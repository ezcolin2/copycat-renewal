import WebCam from "../../layouts/Game";
import Header from "../../layouts/Header";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMainSocket } from "../../contexts/MainSocketContext";
import axios from "axios";

const RoomHeader = ({ session, setSession }) => {
  const { socket, _ } = useMainSocket();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState(null);
  const onClickBtn = useCallback(() => {
    if (session) {
      session.disconnect();
      setSession(undefined);
    }
    navigate("/rooms");
  });
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/rooms/${roomId}`)
      .then((response) => {
        setIsLoading(false);
        setRoomInfo(response.data);
      });
  }, roomId);

  return (
    <>
      {!isLoading && (
        <Header
          title={roomInfo.name}
          btnText="나가기"
          onClickBtn={onClickBtn}
        />
      )}
    </>
  );
};

export default RoomHeader;
