import webSocket from "./socket.js";
import app from "../server.js";
import { io } from "socket.io-client";
import request from "supertest";
import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, initDB } from "../schemas/index.js";
import dotenv from "../config/dotenv/index.js";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("소켓 연결 테스트", () => {
  let loginResponse;
  let server;
  let clientSocket;
  const port = 8000;
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectTestDB(mongoServer);
    await initDB();
    dotenv();
    server = app.listen(port, () => {
      console.log(`${port} 포트 연결`);
    });
    webSocket(server);
    const joinResponse = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(joinResponse.statusCode).toEqual(200);
    expect(joinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    loginResponse = await request(app).post("/api/v1/users/login").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(loginResponse.statusCode).toEqual(200);
    expect(loginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });
  });

  afterAll(async () => {
    // server.close();
    await disconnectTestDB(mongoServer);
  });

  afterEach(() => {
    clientSocket.disconnect();
  });

  test("소켓 연결 실패 - 인증 실패", (done) => {
    clientSocket = io(`http://localhost:${port}`, {
      path: "/socket.io",
    });
    clientSocket.on("connect_error", (error) => {
      expect(error.message).toEqual(
        JSON.stringify({
          code: 401,
          message: "로그인이 필요합니다.",
        })
      );
      clientSocket.disconnect();
      done();
    });
  });

  test("소켓 연결 성공", (done) => {
    console.log(loginResponse.headers["set-cookie"]);
    clientSocket = io(`http://localhost:${port}`, {
      path: "/socket.io",
      extraHeaders: {
        Cookie: loginResponse.headers["set-cookie"],
      },
    });
    clientSocket.on("init", (rooms) => {
      expect(rooms.length).toBe(0);
      clientSocket.disconnect();
      done();
    });
    clientSocket.on("connect_error", (error) => {
      console.log("에러 발생");
      console.log(error.message);
    });
  });
});

describe("소켓 채팅방 테스트", () => {
  let loginResponse;
  let newLoginResponse;
  let server;
  let clientSocket;
  let newClientSocket;
  let mongoServer;

  const port = 8001;
  // 시작하기 전에 로그인, 세션 접속
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectTestDB(mongoServer);
    await initDB();
    dotenv();
    server = app.listen(port, () => {
      console.log(`${port} 포트 연결`);
    });
    webSocket(server);
    const joinResponse = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(joinResponse.statusCode).toEqual(200);
    expect(joinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    loginResponse = await request(app).post("/api/v1/users/login").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(loginResponse.statusCode).toEqual(200);
    expect(loginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });

    // 새로운 유저 생성
    const newJoinResponse = await request(app).post("/api/v1/users/join").send({
      nickname: "chulsoo",
      password: "chulsoo",
    });
    expect(newJoinResponse.statusCode).toEqual(200);
    expect(newJoinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    newLoginResponse = await request(app).post("/api/v1/users/login").send({
      nickname: "chulsoo",
      password: "chulsoo",
    });
    expect(newLoginResponse.statusCode).toEqual(200);
    expect(newLoginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });
  });

  // 테스트가 끝날 때마다 모든 이벤트 제거
  afterEach(() => {
    clientSocket.removeAllListeners();
  });

  // 테스트가 모두 끝나면 서버 종료
  afterAll(async () => {
    // newClientSocket.disconnect();
    // clientSocket.disconnect();
    // server.close();
    await disconnectTestDB(mongoServer);
  });

  test("채팅방 생성, 삭제 성공", (done) => {
    clientSocket = io(`http://localhost:${port}`, {
      path: "/socket.io",
      extraHeaders: {
        Cookie: loginResponse.headers["set-cookie"],
      },
    });
    clientSocket.on("init", (rooms) => {
      expect(rooms.length).toBe(0);
    });
    let room;
    clientSocket.on("newRoom", (createdRoom) => {
      console.log(`새로운 방 정보 ${createdRoom._id}`);
      room = createdRoom;
      clientSocket.emit("deleteRoom", createdRoom._id);
    });
    clientSocket.on("deletedRoom", (res) => {
      expect(res).toEqual({
        code: 200,
        message: `${room._id}번 방 삭제에 성공했습니다.`,
      });
      done();
    });
    clientSocket.on("error", (error) => {
      console.log(error);
      throw new Error(JSON.stringify(error));
    });
    clientSocket.emit("createRoom", "testName");
  });

  test("채팅방 삭제 실패 - 권한 없음", (done) => {
    // 새로운 유저로 소켓 연결
    newClientSocket = io(`http://localhost:${port}`, {
      path: "/socket.io",
      extraHeaders: {
        Cookie: newLoginResponse.headers["set-cookie"],
      },
    });
    newClientSocket.on("init", (rooms) => {
      expect(rooms.length).toBe(0);
      clientSocket.emit("createRoom", "testRoom123");
    });
    let room;
    newClientSocket.on("error", (error) => {
      expect(error).toEqual({ code: 403, message: "방 삭제 권한이 없습니다." });
      done();
    });
    clientSocket.on("newRoom", (createdRoom) => {
      console.log(`받은 방 정보 : ${createdRoom}`);
      expect(createdRoom.name).toBe("testRoom123");
      newClientSocket.emit("deleteRoom", createdRoom._id);
    });
  });

  test("채팅방 삭제 실패 - 방 없음", (done) => {
    clientSocket.on("error", (error) => {
      expect(error).toEqual({
        code: 404,
        message: `방을 찾을 수 없습니다.`,
      });
      done();
    });
    clientSocket.emit("deleteRoom", "ffffffffffffffffffffffff");
  });
});

describe("채팅방 참여 테스트", () => {
  let loginResponse;
  let newLoginResponse;
  let newLoginResponse2;
  let server;
  let clientSocket;
  let room;
  let roomSocket1;
  let roomSocket2;
  let mongoServer;
  const port = 8002;
  // 시작하기 전에 로그인, 세션 접속
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectTestDB(mongoServer);
    await initDB();
    dotenv();
    server = app.listen(port, () => {
      console.log(`${port} 포트 연결`);
    });
    webSocket(server);
  });
  beforeEach(async () => {
    const joinResponse = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(joinResponse.statusCode).toEqual(200);
    expect(joinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    loginResponse = await request(app).post("/api/v1/users/login").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(loginResponse.statusCode).toEqual(200);
    expect(loginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });

    // 새로운 유저 생성
    const newJoinResponse = await request(app).post("/api/v1/users/join").send({
      nickname: "chulsoo",
      password: "chulsoo",
    });
    expect(newJoinResponse.statusCode).toEqual(200);
    expect(newJoinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    newLoginResponse = await request(app).post("/api/v1/users/login").send({
      nickname: "chulsoo",
      password: "chulsoo",
    });
    expect(newLoginResponse.statusCode).toEqual(200);
    expect(newLoginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });
  });

  // 테스트가 끝날 때마다 모든 이벤트 제거
  afterEach(async () => {
    await initDB();
    clientSocket.removeAllListeners();
  });

  // 테스트가 모두 끝나면 서버 종료
  afterAll(async () => {
    // roomSocket1.disconnect();
    // roomSocket2.disconnect();
    // clientSocket.disconnect();
    // server.close();
    await disconnectTestDB(mongoServer);
  });
  test("채팅방 접속 성공", (done) => {
    // 접속
    clientSocket = io(`http://localhost:${port}`, {
      path: "/socket.io",
      extraHeaders: {
        Cookie: loginResponse.headers["set-cookie"],
      },
    });
    clientSocket.on("init", (rooms) => {
      expect(rooms.length).toBe(0);
    });
    // 방 하나 생성
    clientSocket.on("newRoom", (createdRoom) => {
      console.log(`새로운 방 정보 ${createdRoom._id}`);
      console.log(loginResponse.headers["set-cookie"]);
      console.log(newLoginResponse.headers["set-cookie"]);
      clientSocket.disconnect();
      roomSocket1 = io(
        `http://localhost:${port}/rooms?roomId=${createdRoom._id}`,
        {
          path: "/socket.io",
          extraHeaders: {
            Cookie: loginResponse.headers["set-cookie"],
          },
        }
      );
      roomSocket1.on("newMessage", (message) => {
        expect(message).toEqual({
          userName: "system",
          message: `minsoo님께서 입장하셨습니다.`,
        });

        done();
      });
      roomSocket2 = io(
        `http://localhost:${port}/rooms?roomId=${createdRoom._id}`,
        {
          path: "/socket.io",
          extraHeaders: {
            Cookie: newLoginResponse.headers["set-cookie"],
          },
        }
      );
    });
    clientSocket.emit("createRoom", "testName");
  });
});
