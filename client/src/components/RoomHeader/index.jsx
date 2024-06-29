import WebCam from "../../layouts/WebCam";
import Header from "../Header";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoomSocket } from "../../contexts/RoomSocketContext";
import axios from "axios";
import { useOpenVidu } from "../../contexts/OVContext";

/**
 *
 * @returns {JSX.Element} 방 헤더
 *
 * 방에 접속했을 때 상단의 헤더.
 * 헤더의 종류는 여러가지가 있고 공통적으로 Header 컴포넌트를 사용해서 커스텀한다.
 */
const RoomHeader = () => {
  const { leaveSession } = useOpenVidu();
  const { socket, _ } = useRoomSocket(); // 전역 컨텍스트에서 room socket을 가져온다.
  const navigate = useNavigate(); // 나가기 버튼을 눌렀을 때 페이지 이동.
  const { roomId } = useParams(); // url parameter의 room id.
  const [isLoading, setIsLoading] = useState(true); // 로딩 여부.
  const [roomInfo, setRoomInfo] = useState(null); // 접속한 방 정보.

  // 나가기 버튼을 누르면 메인 페이지로 이동.
  const onClickBtn = useCallback(() => {
    // openvidu 연결 끊음.
    leaveSession();

    /**
     * 메인 페이지로 이동.
     * 메인 페이지로 이동하면 room socket은 자동으로 끊김.
     */
    navigate("/rooms");
  });

  // 접속한 방 아이디를 가지고 방 정보를 가져온다.
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
