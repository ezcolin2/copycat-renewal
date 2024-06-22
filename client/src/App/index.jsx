import { Body } from "./styles.jsx";
import { ToastContainer } from "react-toastify";
import Router from "./Router";
import "react-toastify/dist/ReactToastify.css";
import { LoadingProvider } from "../contexts/LoadingContext/index.jsx";
import { Spinner } from "../components/Spinner/index.jsx";
import axios from 'axios';
axios.defaults.withCredentials=true;

function App() {
  return (
    <LoadingProvider>
      <ToastContainer
        position="bottom-right" // 알람 위치 지정
        autoClose={3000} // 자동 off 시간
        hideProgressBar={false} // 진행시간바 숨김
        closeOnClick // 클릭으로 알람 닫기
        rtl={false} // 알림 좌우 반전
        pauseOnFocusLoss // 화면을 벗어나면 알람 정지
        draggable // 드래그 가능
        pauseOnHover // 마우스를 올리면 알람 정지
        theme="light"
        // limit={1} // 알람 개수 제한
      />
      <Body>
        <Spinner />
        <Router />
      </Body>
    </LoadingProvider>
  );
}

export default App;
