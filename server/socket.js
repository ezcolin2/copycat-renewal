import { Server } from "socket.io";
import passport from "passport";
import Room from "./schemas/room.js";
import cors from "cors";
import { isAuthenticated } from "./middlewares/socketAuthMiddleware.js";
import sessionMiddleware from "./middlewares/sessionMiddleware.js";

// server를 받아서 socket과 연결
export default (server) => {
  const io = new Server(server, {
    path: "/socket.io", // 프론트에서 express 서버의 해당 경로의 socket.io.js에 접근 가능
  });

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
      // socket.disconnect();
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
      console.log(acknowledged);
      io.to(socket.id).emit("error", {
        code: 500,
        message: "삭제에 실패했습니다.",
      });
    });
  });

  // 같은 방에 접속한 사람들끼리만 통신할 수 있는 room namespace
  const roomNamespace = io.of("/rooms");

  // 인증된 사람만 방에 접속할 수 있다.
  roomNamespace.use(isAuthenticated);

  // room namespace 연결 이벤트
  roomNamespace.on("connection", (roomSocket) => {
    const user = roomSocket.request.user; // 세션의 유저 정보를 가져온다.
    const roomId = roomSocket.handshake.query.roomId; // query string에서 roomId를 가져온다.
    console.log(`${roomId} 방에 ${user.nickname}님께서 접속하셨습니다.`);

    roomSocket.join(roomId); // 해당 roomId를 가진 방에 소켓 통신 연결
    const connectedClients = roomNamespace.adapter.rooms.get(roomId).size;
    /**
     * 접속 최대 인원은 두 명.
     * 초과하면 에러.
     */
    if (connectedClients > 2) {
      console.log("최대 두명")
      roomSocket.emit("connection_error", {
        status: 503,
        message: "최대 두 명만 참가 가능합니다.",
      });
    }
    console.log(`접속 인원 : ${connectedClients}`);

    // 접속 성공하면 접속 메시지 전송.
    roomNamespace.to(roomId).emit("newMessage", {
      userName: "system",
      message: `${user.nickname}님께서 입장하셨습니다.`,
    });

    // 소켓 연결 종료 이벤트.
    roomSocket.on("disconnect", async () => {
      // 해당 방 인원 모두에게 접속 종료를 알린다.
      roomNamespace.to(roomId).emit("newMessage", {
        userName: "system",
        message: `${user.nickname}님께서 접속을 종료하셨습니다.`,
      });

      // 해당 방 소켓 연결을 끊는다.
      roomSocket.leave(roomId);

      // 현재 방 인원을 출력한다.
      const currentClients = roomNamespace.adapter.rooms.get(roomId)?.size || 0;
      console.log(`접속 인원 : ${currentClients}`);

      // 방에 아무도 없다면 방을 데이터베이스엥서 삭제한다.
      if (currentClients == 0) {
        // 방을 없애는데 성공했다면 전체 소켓에 방 삭제 알림을 전송한다.
        const { acknowledged } = await Room.deleteOne({ _id: roomId });
        if (acknowledged) {
          io.emit("deletedRoom", {
            code: 200,
            message: `${roomId}번 방 삭제에 성공했습니다.`,
            _id: roomId,
          });
          return;
        }
      }
    });

    // 소켓 에러 이벤트
    roomSocket.on("error", (error) => {
      console.error(error);
    });

    // 소켓 채팅 이벤트
    roomSocket.on("chat", (message) => {
      // 같은 room namespace에 연결된 소켓끼리 통신을 한다.

      roomNamespace.to(roomId).emit("newMessage", {
        userName: user.nickname,
        message,
      });
    });
  });
};
