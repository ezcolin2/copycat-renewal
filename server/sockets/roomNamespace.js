import { isAuthenticated } from "../middlewares/socketAuthMiddleware.js";
import Room from "../schemas/room.js";
import {
  createQueue,
  enqueueData,
  dequeueData,
  isQueueEmpty,
  deleteQueue,
} from "../utils/redis/redisQueue.js";
export default function attachRoomNamespace(io) {
  // 같은 방에 접속한 사람들끼리만 통신할 수 있는 room namespace

  const roomNamespace = io.of("/rooms");
  // 인증된 사람만 방에 접속할 수 있다.

  roomNamespace.use(isAuthenticated);
  // room namespace 연결 이벤트

  roomNamespace.on("connection", async (roomSocket) => {
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
      roomSocket.emit("custom_error", {
        status: 503,
        message: "최대 두 명만 참가 가능합니다.",
      });
    }
    console.log(`접속 인원 : ${connectedClients}`);

    // 첫 번째 참가자는 제외하고 Room의 participant 업데이트
    if (connectedClients == 2) {
      await Room.updateOne(
        {
          _id: roomId,
        },
        {
          participant: user.nickname,
        }
      );
    }

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
      // 방에 아무도 없다면 방을 데이터베이스에서 삭제한다.

      // Room의 participant 업데이트
      Room.updateOne(
        {
          _id: roomId,
        },
        {
          participant: null,
        }
      );

      if (currentClients === 0) {
        // 방을 없애는데 성공했다면 전체 소켓에 방 삭제 알림을 전송한다.
        const { acknowledged } = await Room.deleteOne({ _id: roomId });
        if (acknowledged) {
          io.emit("deletedRoom", {
            code: 200,
            message: `${roomId}번 방 삭제에 성공했습니다.`,
            _id: roomId,
          });
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

    // 게임 시작 이벤트
    roomSocket.on("start", async () => {
      const findRoom = await Room.findOne({ _id: roomId }); // roomId를 바탕으로 방 정보를 가져온다.

      // 만약 방 주인이 아닌 사람이 게임 시작 요청을 하면 거부한다.
      if (findRoom.master !== user.nickname) {
        roomSocket.emit("custom_error", {
          status: 403,
          message: "접근 권한이 없습니다.",
        });
      }
      // 방 주인이 시작 요청을 하면 승인한다.
      else {
        // 인원 수가 부족하면 거부한다.
        const currentClients = roomNamespace.adapter.rooms.get(roomId)?.size || 0;
        if (currentClients < 2){
          roomSocket.emit("custom_error", {
            status: 403,
            message: "인원 수가 부족합니다.",
          });
          return;
        }

        const totalRound = 3; // 총 라운드 수
        const findRoom = await Room.findOne({_id: roomId});

        // 만약 게임이 시작되었다면 거부한다.
        if (findRoom.isStarted){
          roomSocket.emit("custom_error", {
            status: 400,
            message: "이미 게임이 시작되었습니다.",
          });
          return;
        }
        // 게임이 시작된 것을 갱신한다.
        await Room.updateOne(
          {
            _id: roomId,
          },
          {
            isStarted: true
          }
        );
        createQueue(roomId); // room id에 해당하는 큐를 생성한다.

        // 턴 정보들을 미리 큐에 넣어둠
        for (let i = 0; i<totalRound; i++){
          enqueueData(roomId, {
            nickname: findRoom.master,
            role: "ATTACK"
          });
          enqueueData(roomId, {
            nickname: findRoom.participant,
            role: "DEFENSE"
          });
          enqueueData(roomId, {
            nickname: findRoom.participant,
            role: "ATTACK"
          });
          enqueueData(roomId, {
            nickname: findRoom.master,
            role: "DEFENSE"
          });
        }

        const turnInfo = await dequeueData(roomId);
        roomNamespace.to(roomId).emit("newTurn", turnInfo);

      }
    });
  });
}
