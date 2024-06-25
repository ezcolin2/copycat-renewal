import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import UserVideoComponent from "../../components/openvidu";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
// import SkeletonCanvas from "../../components/SkeletonCanvas";

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3001/";

const WebCam = () => {
  const {myInfo, isError, isLoading} = useUser();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
  const [OV, setOV] = useState(undefined);

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((sub) => sub !== streamManager)
    );
  };

  const joinSession = () => {
    // --- 1) Get an OpenVidu object ---
    const OVInstance = new OpenVidu();
    setOV(OVInstance);

    // --- 2) Init a session ---
    const mySession = OVInstance.initSession();
    setSession(mySession);

    // --- 3) Specify the actions when events take place in the session ---
    mySession.on("streamCreated", (event) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    // --- 4) Connect to the session with a valid user token ---
    getToken().then((token) => {
      console.log(`토큰 연결 : ${token}`);
      mySession
        .connect(token, { clientData: myInfo.nickname })
        .then(async () => {
          // --- 5) Get your own camera stream ---
          const publisher = await OVInstance.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          });

          // --- 6) Publish your stream ---
          mySession.publish(publisher);

          // Obtain the current video device in use
          const devices = await OVInstance.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          const currentVideoDeviceId = publisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          setCurrentVideoDevice(currentVideoDevice);
          setMainStreamManager(publisher);
          setPublisher(publisher);
        })
        .catch((error) => {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        });
    });
  };

  const leaveSession = useCallback(() => {
    // 세션 나간 후 rooms 페이지로 이동
    if (session) {
      session.disconnect();
      navigate("/rooms");
    }


  }, [session]);

  const getToken = async () => {
    const sessionId = await createSession(roomId);
    return await createToken(sessionId);
  };

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/v1/openvidu/connections",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(response.data.sessionId);
    return response.data.sessionId; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/v1/openvidu/connections/" + sessionId,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(`creat token:${response.data}`);
    console.log(response.data);
    return response.data.token; // The token
  };

  useEffect(() => {
    const onbeforeunload = (event) => {
      leaveSession();
    };
    window.addEventListener("beforeunload", onbeforeunload);
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  }, [leaveSession]);

  return (
    <div className="container">
      {session === undefined ? (
        <input
          className="btn btn-large btn-success"
          type="button"
          id="buttonjoinSession"
          onClick={joinSession}
          value="join session"
        />
      ) : null}

      {session !== undefined ? (
        <div id="session">
          <div id="session-header">
            <h1 id="session-title">{roomId}</h1>
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="Leave session"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {mainStreamManager !== undefined ? (
              <div id="main-video" className="col-md-6">
                <UserVideoComponent streamManager={mainStreamManager} />
              </div>
            ) : null}
            <div id="video-container" className="col-md-6">
              {/* {publisher !== undefined ? (
                            <div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
                                <UserVideoComponent streamManager={publisher} />
                            </div>
                        ) : null} */}
              {subscribers.map((sub, i) => (
                <div
                  key={sub.id}
                  className="stream-container col-md-6 col-xs-6"
                  // onClick={() => handleMainVideoStream(sub)}
                >
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WebCam;
