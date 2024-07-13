import WebCam from "../../layouts/WebCam";
import RoomHeader from "../../components/RoomHeader";
import { RoomSocketProvider } from "../../contexts/RoomSocketContext";
import { useParams } from "react-router-dom";
import { OVContextProvider } from "../../contexts/OVContext";

const Game = () => {
  const { roomId } = useParams();
  return (
    <RoomSocketProvider roomId={roomId}>
      <OVContextProvider>
        <RoomHeader />
        <WebCam />
      </OVContextProvider>
    </RoomSocketProvider>
  );
};

export default Game;
