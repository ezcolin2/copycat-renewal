import React, { useCallback, useState } from "react";
import { Page, Button, Form, Input, Message, GoToJoin } from "./styles";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";
const LogIn = ({ goToJoin }) => {
  const navigate = useNavigate(); // 페이지 이동 훅.

  const { startLoading, stopLoading } = useLoading(); // 전역적으로 관리되는 isLoading 값을 변경하기 위한 함수.
  const [nickname, setNickname] = useState(""); // 닉네임 input 값.
  const [password, setPassword] = useState(""); // 비밀번호 input 값.

  // 닉네임 input 변경 함수.
  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);

  // 비밀번호 input 변경 함수.
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  // 로그인 요청 함수.
  const login = useCallback(
    (e) => {
      e.preventDefault(); // 새로고침 방지.
      startLoading(); // 로딩 바 띄움.
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/login`, {
          nickname,
          password,
        })
        .then((response) => {
          // 로그인 성공하면 성공 메시지 toast로 띄운다. 
          toast.success(response.data.message);
          // 메인 페이지로 이동.
          navigate("/rooms");
        })
        .catch((error) => {
          // 로그인 실패하면 에러 메시지 toast로 띄운다. 
          toast.error(error.response.data.message);
        })
        .finally(() => {
          // 성공, 실패 관계없이 응답이 오면 로딩바 없앰.
          stopLoading();
        });
    },
    [nickname, password]
  );
  return (
    <Page>
      <Form onSubmit={login}>
        <Input
          value={nickname}
          onChange={onChangeNickname}
          type="text"
          placeholder="닉네임을 입력하세요"
        />
        <Input
          value={password}
          onChange={onChangePassword}
          type="password"
          placeholder="비밀번호를 입력하세요"
        />

        <Button>로그인</Button>
        <Message>
          계정이 없으신가요?{" "}
          <GoToJoin onClick={goToJoin}>회원가입 하러가기</GoToJoin>
        </Message>
      </Form>
    </Page>
  );
};
export default LogIn;
