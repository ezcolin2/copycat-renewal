import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInAndJoin from "../pages/LogInAndJoin";
import Main from "../pages/Main";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogInAndJoin />}></Route>
        <Route path="/rooms" element={<Main />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
