import WebCam from "../../layouts/Game";
import RoomHeader from "../../components/RoomHeader";
import { MainSocketProvider } from "../../contexts/MainSocketContext";
import {useState} from 'react';

const Room = () => {
  const [session, setSession] = useState(undefined);
  return (
    <MainSocketProvider>
      <RoomHeader session = {session} setSession={setSession}/>      
      <WebCam session = {session} setSession={setSession}/>
    </MainSocketProvider>
  );
};

export default Room;
