import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

// 전역 socket context 생성
const MainSocketContext = createContext();

export const useMainSocket = () => useContext(MainSocketContext);

/**
 * @typedef {Object} MainSocketProviderProps
 * @property {React.ReactNode} children 자식 컴포넌트
 */

/**
 *
 * @param {MainSocketProviderProps} props
 * @returns {JSX.Element} children을 Provider로 묶어서 하위 컴포넌트에서 소켓을 사용할 수 있다.
 * 채팅방 목록을 볼 수 있는 메인 페이지에서 소켓 연결을 맺은 후
 * 소켓 객체를 하위 컴포넌트에서 사용할 수 있게 한다.
 */
export const MainSocketProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]); // 현재 존재하는 모든 방 정보
  const [mainSocket, setMainSocket] = useState(null); // 하위 컴포넌트에게 전달해 줄 소켓 객체
  useEffect(() => {
    // 소켓 연결
    const socket = io(`${process.env.REACT_APP_SERVER_URL}`, {
      path: "/socket.io",
      transports: ["websocket"],
    });
    // 처음 소켓 연결 후 초기 방 정보를 받아와서 UI에 보여준다.
    socket.on("init", (data) => {
      setRooms(data);
      console.log(rooms);
      socket.off("init");
    });

    // 새로운 메시지를 받으면 콘솔에 출력한다.
    socket.on("newMessage", (data) => {
      console.log(data);
    });

    // 연결 오류가 발생하면 메시지를 콘솔에 출력한다.
    socket.on("connect_error", (err) => {
      console.log(JSON.parse(err.message));
    });

    // 새로운 방이 생성되면 rooms에 추가하여 UI에 반영되도록 한다.
    socket.on("newRoom", (newRoom) => {
      setRooms((prev) => [...prev, newRoom]);
      console.log(newRoom);
    });

    // 방이 삭제되면 rooms에서 제거하여 UI에 반영되도록 한다.
    socket.on("deletedRoom", (deletedRoom) => {
      setRooms((prev) => prev.filter((room) => room._id != deletedRoom._id));
      console.log(deletedRoom);
    });

    // 소켓 연결을 맺고 이벤트를 모두 설정한 후에는 socket에 저장한다.
    setMainSocket(socket);

    // 컴포넌트가 언마운트 될 때 소켓 연결을 끊는다.
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <MainSocketContext.Provider value={{ mainSocket, rooms }}>
      {children}
    </MainSocketContext.Provider>
  );
};
