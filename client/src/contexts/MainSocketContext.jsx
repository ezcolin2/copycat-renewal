import { createContext, useContext, useState, useEffect } from "react"
import io from 'socket.io-client';

const MainSocketContext = createContext();
export const useMainSocket = () => useContext(MainSocketContext);

export const MainSocketProvider = ({children})=>{
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const socket = io(`http://localhost:3001`, {
            path: "/socket.io",
            transports: ["websocket"],
    
          });
        socket.on("init", (data) => {
          console.log(data);
          socket.off("init");
        });
        socket.on("newMessage", (data) => {
          console.log(data);
        });
        socket.on("connect_error", (err) => {
          console.log(JSON.parse(err.message));
        });
        socket.on("newRoom", (newRoom) => {
          console.log(newRoom);
        });
        socket.on("deletedRoom", (deletedRoom) => {
          console.log(deletedRoom);
        });
        setSocket(socket);
        return ()=>{
            socket.disconnect();
        }
      }, []);
    return (
        <MainSocketContext.Provider value = {socket}>
            {children}
        </MainSocketContext.Provider>
    )

}