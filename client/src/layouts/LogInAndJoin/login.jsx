import React, { useCallback, useState } from "react";
import { Page, Button, Form, Input, Message, GoToJoin } from "./styles";
import axios from "axios";
const LogIn = ({ goToJoin }) => {
  // setIsLogin : 외부에서 로그인 화면인지 회원가입 화면인지 구분하는 state를 바꿈
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const login = useCallback((e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/api/v1/users/login", {
      nickname,
      password,
    }).then((response)=>{
      console.log(response);
    });
  }, [nickname, password]);
  return (
    <Page>
      <Form onSubmit = {login}>
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
