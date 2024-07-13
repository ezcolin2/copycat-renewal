import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInAndJoin from "../pages/LogInAndJoin";
import Main from "../pages/Main";
import Room from "../pages/Game";
import { ProtectedRoute } from "../components/ProtectedRoute";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogInAndJoin />}></Route>
        <Route path="/rooms" element={
          <ProtectedRoute redirectUrl = '/'>
            <Main />
          </ProtectedRoute>
        }></Route>

        <Route path="/rooms/:roomId" element={
          <ProtectedRoute redirectUrl = '/'>
            <Room />
          </ProtectedRoute>
        }></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
