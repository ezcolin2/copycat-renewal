import React, { useCallback, useState } from "react";
import { Page, Button, Form, Input, Message, GoToJoin } from "./styles";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";
const LogIn = ({ goToJoin }) => {
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const login = useCallback(
    (e) => {
      e.preventDefault();
      startLoading();
      axios
        .post("http://localhost:3001/api/v1/users/login", {
          nickname,
          password,
        })
        .then((response) => {
          console.log(response);
          navigate("/rooms");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
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
