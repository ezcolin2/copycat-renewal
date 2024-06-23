import { createContext, useContext, useState, useEffect } from "react"
import io from 'socket.io-client';

const MainSocketContext = createContext();
export const useMainSocket = () => useContext(MainSocketContext);

export const MainSocketProvider = ({children})=>{
  const [rooms, setRooms] = useState([]);
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const socket = io(`http://localhost:3001`, {
            path: "/socket.io",
            transports: ["websocket"],
    
          });
        socket.on("init", (data) => {
          setRooms(data);
          console.log(rooms);
          socket.off("init");
        });
        socket.on("newMessage", (data) => {
          console.log(data);
        });
        socket.on("connect_error", (err) => {
          console.log(JSON.parse(err.message));
        });
        socket.on("newRoom", (newRoom) => {
          setRooms((prev) => [...prev, newRoom])
          console.log(newRoom);
        });
        socket.on("deletedRoom", (deletedRoom) => {
          setRooms((prev) => prev.filter((room)=>room._id!=deletedRoom._id))
          console.log(deletedRoom);
        });
        setSocket(socket);
        return ()=>{
            socket.disconnect();
        }
      }, []);
    return (
        <MainSocketContext.Provider value = {{socket, rooms}}>
            {children}
        </MainSocketContext.Provider>
    )

}