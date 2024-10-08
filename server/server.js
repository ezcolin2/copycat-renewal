import express from "express";
import userRouter from "./routes/user.js";
import roomRouter from "./routes/room.js";
import imageRouter from "./routes/image.js";
import openviduRouter from "./routes/openvidu.js";
import cors from "cors";
import passportConfig from "./passport/index.js";
import passport from "passport";
import sessionMiddleware from "./middlewares/sessionMiddleware.js";
// import { connect } from "./schemas/index.js";
// connect();
// dotenv();
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(sessionMiddleware);
passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("../client/build"));
// app.get('/', (req, res)=>{
//     res.sendFile('../client/build/index.html');

// })
app.use("/api/v1/users", userRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/openvidu/connections", openviduRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("에러가 발생하였습니다.");
});
// app.get('*', (req, res)=>{
//     res.sendFile('../client/build/index.html');

// })
export default app;
