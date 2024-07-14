import React, { useCallback, useEffect, useState } from "react";
import UserVideoComponent from "../../components/UserVideo";
import { useOpenVidu } from "../../contexts/OVContext";
import { useParams } from "react-router-dom";
import { JoinSessionBtn } from "./styles";
import { useRoomSocket } from "../../contexts/RoomSocketContext";
import axios from "axios";
const WebCam = () => {
  const { roomId } = useParams();
  const [userData, setUserData] = useState(null); // 내 정보
  const [roomData, setRoomData] = useState(null); // 방 정보
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 여부
  const {roomSocket} = useRoomSocket();
  // 전역적으로 관리되는 세션 정보 가져오기.
  const { session, joinSession, leaveSession, mainStreamManager, subscribers } =
    useOpenVidu();

  // 유저 정보와 방 정보 가져오기.
  const fetchData = async () => {
    const [userResponse, roomResponse] = await Promise.all([
      axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/myself`),
      axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/rooms/${roomId}`),
    ]);
    setUserData(userResponse.data);
    setRoomData(roomResponse.data);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
    window.addEventListener("beforeunload", leaveSession);
    return () => {
      leaveSession();
      window.removeEventListener("beforeunload", leaveSession);
    };
  }, []);
  const startGame = useCallback(() => {
    console.log(roomSocket);
    roomSocket.emit("start");
  }, [roomSocket]);

  return (
    <div className="container">
      {session === null ? (
        <JoinSessionBtn onClick={joinSession}>캠 켜기</JoinSessionBtn>
      ) : null}

      {session !== null ? (
        <div id="session">
          <div id="session-header"></div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {mainStreamManager !== undefined ? (
              <div>
                <div id="main-video" className="col-md-6">
                  <UserVideoComponent streamManager={mainStreamManager} />
                </div>
                <JoinSessionBtn
                  variant="outlined"
                  id="buttonLeaveSession"
                  onClick={leaveSession}
                >
                  캠 끄기
                </JoinSessionBtn>
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
          {!isLoading && userData.nickname == roomData.master ? <button onClick = {startGame}>게임 시작</button> : <button>준비</button>}
        </div>
      ) : null}
    </div>
  );
};

export default WebCam;
