import {
  createContext,
  useContext,
  useState,
  useEffect,
  Component,
} from "react";
import io from "socket.io-client";

// 전역 socket context 생성
const RoomSocketContext = createContext();

// 외부에서 context 내부 값에 접근하기 위한 함수
export const useRoomSocket = () => useContext(RoomSocketContext);

/**
 *
 * @param {React.ReactNode} children 자식 컴포넌트
 * @param {number} roomId 방 아이디
 * @returns {JSX.Element} children을 Provider로 묶어서 하위 컴포넌트에서 소켓을 사용할 수 있다.
 */
export const RoomSocketProvider = ({ children, roomId }) => {
  const [socket, setSocket] = useState(null);
  // room namespace에 처음 렌더링 될 때 한 번만 접속한다.
  useEffect(() => {
    // room namespace에 연결
    const socket = io(
      `${process.env.REACT_APP_SERVER_URL}/rooms?roomId=${roomId}`,
      {
        path: "/socket.io",
        transports: ["websocket"],
      }
    );
    // 연결 오류가 발생하면 로그를 출력한다.
    socket.on("connect_error", (err) => {
      console.log(JSON.parse(err.message));
    });

    // 새로운 메시지를 받으면 콘솔에 출력한다.
    // TODO: 채팅창 기능 구현
    socket.on("newMessage", (data) => {
      console.log(data);
    });

    // socket 세팅
    setSocket(socket);

    // 컴포넌트가 언마운트 될 때 소켓 연결을 끊는다.
    return () => {
      socket.disconnect();
    };
  }, []);

  // socket을 하위 컴포넌트가 사용할 수 있도록 한다.
  return (
    <RoomSocketContext.Provider value={{ socket }}>
      {children}
    </RoomSocketContext.Provider>
  );
};
