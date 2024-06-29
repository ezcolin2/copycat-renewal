import Header from "../Header";
import ProfileCard from "../UserProfileCard";
import { Grid } from "@mui/material";
import RoomList from "../../components/RoomList";
import { MainSocketProvider } from "../../contexts/MainSocketContext";
import useUser from "../../hooks/useUser";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * 
 * @returns {JSX.Element} 방 헤더
 * 
 * 메인 페이지에 접속했을 때 상단의 헤더.
 * 헤더의 종류는 여러가지가 있고 공통적으로 Header 컴포넌트를 사용해서 커스텀한다.
 */
const MainHeader = () => {
  const navigate = useNavigate(); // 페이지 이동.
  const { myInfo, isError, isLoading } = useUser(); // 유저 정보를 가져오는 swr 커스텀 훅.

  // 로그아웃 버튼을 누르면 로그아웃 하고 로그인, 회원가입 페이지로 이동한다.
  const onClickBtn = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/logout`)
      .then(() => {
        toast.success("로그아웃에 성공했습니다.");
        navigate("/");
      });
  });

  // 유저 정보를 가져오는데 실패한다면 로그인, 회원가입 페이지로 이동한다.
  useEffect(() => {
    if (isError) {
      toast.error("접근 권한이 없습니다.");
      navigate("/");
    }
  }, [isError]);

  return (
    <>
      {!isError && !isLoading && (
        <Header
          title={`${myInfo.nickname}님 환영합니다!`}
          btnText="Logout"
          onClickBtn={onClickBtn}
        />
      )}
    </>
  );
};
export default MainHeader;
