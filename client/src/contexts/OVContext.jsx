import React, { createContext, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import useUser from "../hooks/useUser";

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3001/";
// 전역 OpenVidu context 생성
const OVContext = createContext();

// 외부에서 context 내부 값에 접근하기 위한 함수
export const useOpenVidu = () => useContext(OVContext);

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children 자식 컴포넌트
 * @returns {JSX.Element} children을 Provider로 묶어서 하위 컴포넌트에서 소켓을 사용할 수 있다.
 * 채팅방 목록을 볼 수 있는 메인 페이지에서 소켓 연결을 맺은 후
 * 소켓 객체를 하위 컴포넌트에서 사용할 수 있게 한다.
 */
export const OVContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const { myInfo, isError, isLoading } = useUser();
  const { roomId } = useParams();
  const navigate = useNavigate();
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

  return (
    <OVContext.Provider
      value={{
        session,
        joinSession,
        leaveSession,
        mainStreamManager,
        subscribers,
      }}
    >
      {children}
    </OVContext.Provider>
  );
};
