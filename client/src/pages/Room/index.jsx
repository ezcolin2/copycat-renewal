import WebCam from "../../layouts/Game";
import RoomHeader from "../../components/RoomHeader";
import { RoomSocketProvider } from "../../contexts/RoomSocketContext";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams();
  const [session, setSession] = useState(undefined);
  return (
    <RoomSocketProvider roomId={roomId}>
      <RoomHeader session={session} setSession={setSession} />
      <WebCam session={session} setSession={setSession} />
    </RoomSocketProvider>
  );
};

export default Room;
