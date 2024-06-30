import React, { useEffect } from "react";
import UserVideoComponent from "../../components/openvidu";
import { useOpenVidu } from "../../contexts/OVContext";
import { useParams } from "react-router-dom";
import { JoinSessionBtn } from "./styles";
import { Button } from "@mui/material";

const WebCam = () => {
  const { session, joinSession, leaveSession, mainStreamManager, subscribers } =
    useOpenVidu();
  useEffect(() => {
    window.addEventListener("beforeunload", leaveSession);
    return () => {
      leaveSession();
      window.removeEventListener("beforeunload", leaveSession);
    };
  }, []);

  return (
    <div className="container">
      {session === null ? (
        <JoinSessionBtn
          onClick={joinSession}
        >캠 켜기</JoinSessionBtn>
      ) : null}

      {session !== null ? (
        <div id="session">
          <div id="session-header">
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {mainStreamManager !== undefined ? (
              <div>              <div id="main-video" className="col-md-6">
                <UserVideoComponent streamManager={mainStreamManager} />
              </div>
            <JoinSessionBtn
              variant="outlined"
              id="buttonLeaveSession"
              onClick={leaveSession}
            >캠 끄기</JoinSessionBtn>
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
