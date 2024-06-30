import { Server } from "socket.io";
import attachDefaultNamespace from "./defaultNamespace.js";
import attachRoomNamespace from "./roomNamespace.js";

export default function socketConnect(server) {
  const io = new Server(server, {
    path: "/socket.io", // 프론트에서 express 서버의 해당 경로의 socket.io.js에 접근 가능
  });
  attachDefaultNamespace(io);
  attachRoomNamespace(io);
}
