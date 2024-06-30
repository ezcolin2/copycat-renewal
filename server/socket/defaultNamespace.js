import { Server } from "socket.io";
import passport from "passport";
import cors from "cors";
import sessionMiddleware from "../middlewares/sessionMiddleware.js";
import { isAuthenticated } from "../middlewares/socketAuthMiddleware.js";
import Room from "../schemas/room.js";

export default function attachDefaultNamespace(io) {


  // cors 에러 해결.
  io.engine.use(
    cors({
      origin: "http://localhost:3000", // 연결 허용할 도메인
      credentials: true, // 도메인이 다른 클라이언트와 쿠키 공유.
    })
  );

  // 세션 공유를 위해 express 서버와 동일한 session middleware를 장착한다.
  io.engine.use(sessionMiddleware);
  // 인증, 인가를 위한 passport 설정.
  io.engine.use(passport.initialize());
  io.engine.use(passport.session());
  // 인증된 사람만 접속할 수 있다.
  io.use(isAuthenticated);
  // 소켓 연결 이벤트
  io.on("connection", async (socket) => {
    // 세션에 저장된 유저 정보
    const user = socket.request.user;
    console.log(`${user.nickname}님께서 접속하셨습니다.`);

    // 현재 생성되어 있는 방 정보를 가져온다.
    const rooms = await Room.find();

    // 현재 생성된 모든 방 정보를 전달한다.
    socket.emit("init", rooms);

    // 소켓 종료 이벤트
    socket.on("disconnect", () => {
      console.log(`${user.nickname}님께서 접속을 종료하셨습니다.`);
    });

    // 소켓 에러 이벤트
    socket.on("error", (error) => {
      console.error(error);
    });

    // 소켓 방 생성 이벤트
    socket.on("createRoom", async (roomName) => {
      console.log(
        `${user.nickname}님께서 ${roomName} 방 생성을 요청하셨습니다.`
      );
      const newRoom = new Room({
        name: roomName,
        master: user.nickname,
      });

      // 생성된 방 정보를 모두에게 전달한다.
      const createdRoom = await newRoom.save();
      io.emit("newRoom", createdRoom);
    });

    // 방 삭제 이벤트
    socket.on("deleteRoom", async (_id) => {
      console.log(`${user.nickname}님께서 ${_id} 방 삭제를 요청하셨습니다.`);
      const findRoom = await Room.findOne({ _id });
      if (!findRoom) {

        // 찾은 방이 없는 경우에 대한 처리
        io.to(socket.id).emit("error", {
          code: 404,
          message: `방을 찾을 수 없습니다.`,
        });
        return;
      }

      // 만약 방 주인이 아닌 사람이 삭제 요청 보내면 거절
      if (user.nickname !== findRoom.master) {
        io.to(socket.id).emit("error", {
          code: 403,
          message: "방 삭제 권한이 없습니다.",
        });
        return;
      }

      const { acknowledged } = await Room.deleteOne({ _id });
      if (acknowledged) {
        io.emit("deletedRoom", {
          code: 200,
          message: `${_id}번 방 삭제에 성공했습니다.`,
        });
        return;
      }

      io.to(socket.id).emit("error", {
        code: 500,
        message: "삭제에 실패했습니다.",
      });
    });
  });
}
