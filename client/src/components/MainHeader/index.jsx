import Header from "../../layouts/Header";
import ProfileCard from "../../components/ProfileCard";
import { Grid } from "@mui/material";
import RoomList from "../../components/RoomList";
import { MainSocketProvider } from "../../contexts/MainSocketContext";
import useUser from "../../hooks/useUser";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MainHeader = () => {
  const navigate = useNavigate();
  const { myInfo, isError, isLoading } = useUser();
  const onClickBtn = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/logout`)
      .then(() => {
        toast.success("로그아웃에 성공했습니다.");
        navigate("/");
      });
  });
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
