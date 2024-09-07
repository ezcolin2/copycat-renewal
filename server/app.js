import server from "./server.js";
import socketConnect from "./sockets/socket.js";
import { connectDB } from "./schemas/index.js";
import dotenv from "./config/dotenv/index.js";

const setting = async () => {
  await connectDB();
  dotenv();
  const app = server.listen(process.env.SERVER_PORT, () => {
    console.log(`${process.env.SERVER_PORT} 포트 서버 연결`);
  });
  socketConnect(app);
};
setting();
