import React, { useCallback, useState } from "react";
import { Page, Button, Form, Input, Message, GoToJoin } from "./styles";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoading } from "../../contexts/LoadingContext";

const Join = ({ goToLogin }) => {
  const { startLoading, stopLoading } = useLoading(); // 전역 컨텍스트의 로딩 여부.
  const [nickname, setNickname] = useState(""); // 닉네임 input 값.
  const [password, setPassword] = useState(""); // 비밀번호 input 값.
  const [passwordCheck, setPasswordCheck] = useState(""); // 비밀번호 확인 input 값.

  // 닉네임 변경 함수.
  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);

  // 비밀번호 변경 함수.
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  // 비밀번호 확인 변경 함수.
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
  }, []);

  // 회원가입 요청 함수.
  const join = useCallback(
    (e) => {
      e.preventDefault(); // 새로고침 방지.
      startLoading(); // 로딩 바 띄움.
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/users/join`,
          {
            nickname,
            password,
          },
        )
        .then((response) => {
          // 회원가입 성공하면 성공 메시지 toast로 띄운다. 
          toast.success(response.data.message);
        })
        .catch((error) => {
          // 오류 발생하면 오류 메시지 toast로 띄운다.
          toast.error(error.response.data.message);
        })
        .finally(() => {
          // 성공, 오류 상관없이 응답이 오면 로딩 바 없앰.
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
