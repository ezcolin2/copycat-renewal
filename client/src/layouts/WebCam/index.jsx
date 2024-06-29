import React, { useEffect } from "react";
import UserVideoComponent from "../../components/openvidu";
import { useOpenVidu } from "../../contexts/OVContext";
import { useParams } from "react-router-dom";

const WebCam = () => {
  const { roomId } = useParams();
  const { session, joinSession, leaveSession, mainStreamManager, subscribers } =
    useOpenVidu();
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
      {session === null ? (
        <input
          className="btn btn-large btn-success"
          type="button"
          id="buttonjoinSession"
          onClick={joinSession}
          value="join session"
        />
      ) : null}

      {session !== null ? (
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
