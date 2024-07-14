import { createContext, useContext, useRef } from "react";

// 전역 ref context 생성
const RefContext = createContext();

// 외부에서 context 내부 값에 접근하기 위한 함수
export const useRefContext = () => useContext(RefContext);

/**
 * @param {React.ReactNode} props.children 자식 컴포넌트
 * @returns {JSX.Element} children을 Provider로 묶어서 하위 컴포넌트에서 소켓을 사용할 수 있다.
 * openvidu/index.jsx에서 전역적으로 사용하는 context.
 * 영상을 송출하는 videoRef와 스켈레톤을 그리는 canvasRef를 관리한다.
 * UserVideoComponent마다 이 context를 관리한다.
 */
export const RefContextProvider = ({ children }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  return (
    <RefContext.Provider value={{ videoRef, canvasRef }}>
      {children}
    </RefContext.Provider>
  );
};
