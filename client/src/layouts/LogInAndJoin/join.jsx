import React, { useCallback, useState } from "react";
import { Page, Button, Form, Input, Message, GoToJoin } from "./styles";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoading } from "../../contexts/LoadingContext";

const Join = ({ goToLogin }) => {
  const { startLoading, stopLoading } = useLoading();
  // setIsLogin : 외부에서 로그인 화면인지 회원가입 화면인지 구분하는 state를 바꿈
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
  }, []);
  const join = useCallback(
    (e) => {
      e.preventDefault();
      startLoading();
      axios
        .post(
          "http://localhost:3001/api/v1/users/join",
          {
            nickname,
            password,
          },
        )
        .then((response) => {
          startLoading();
          toast.success(response.data.message);
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
      <Form onSubmit={join}>
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
        <Input
          value={passwordCheck}
          onChange={onChangePasswordCheck}
          type="password"
          placeholder="비밀번호를 한 번 더 입력하세요"
        />

        <Button>회원가입</Button>
        <Message>
          이미 계정이 있나요?{" "}
          <GoToJoin onClick={goToLogin}>로그인 하러가기</GoToJoin>
        </Message>
      </Form>
    </Page>
  );
};
export default Join;
