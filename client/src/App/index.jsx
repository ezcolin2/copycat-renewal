import { useState } from "react";
import logo from "./logo.svg";
import { Body } from "./styles.jsx";
import LogInAndJoin from "../pages/LogInAndJoin";
import axios from "axios";
function App() {
  axios
    .post("http://localhost:3001/api/v1/users/join", {
      nickname: "hello",
      password: "el",
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => console.log(error));
  return (
    <Body>
      <LogInAndJoin></LogInAndJoin>
    </Body>
  );
}

export default App;
