import app from "../server.js";
import request from "supertest";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../schemas/index.js";
import dotenv from "../config/dotenv/index.js";

const initDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

describe("POST /api/v1/users/join", () => {
  beforeEach(async () => {
    await connectDB();
    await initDB();
    dotenv();
  });
  test("회원가입 성공, 이름 중복 테스트", async () => {
    // 회원가입 성공
    const response = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    // 이름 중복
    const response2 = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(response2.statusCode).toEqual(409);
    expect(response2.body).toEqual({
      code: 409,
      message: "유저 이름 중복",
    });
  });
});

describe("POST /api/v1/users/login", () => {
  beforeEach(async () => {
    await connectDB();
    await initDB();
    dotenv();
  });
  afterAll(() => {});
  // 회원가입 먼저
  test("회원가입 성공", async () => {
    const response = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });
  });

  // 회원가입 후 로그인
  test("로그인 성공", async () => {
    const response = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    const response2 = await request(app).post("/api/v1/users/login").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(response2.statusCode).toEqual(200);
    expect(response2.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });
  });

  test("로그인 실패 - 비밀번호 불일치", async () => {
    const response = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    const response2 = await request(app).post("/api/v1/users/login").send({
      nickname: "minsoo",
      password: "minsoo1",
    });
    expect(response2.statusCode).toEqual(400);
    expect(response2.body).toEqual({
      code: 400,
      message: "비밀번호가 일치하지 않습니다.",
    });
  });

  test("로그인 실패 - 유저 없음", async () => {
    const response = await request(app).post("/api/v1/users/join").send({
      nickname: "minsoo",
      password: "minsoo",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    const response2 = await request(app).post("/api/v1/users/login").send({
      nickname: "minsoo1",
      password: "minsoo1",
    });
    expect(response2.statusCode).toEqual(404);
    expect(response2.body).toEqual({
      code: 404,
      message: "해당 유저가 존재하지 않습니다.",
    });
  });
});

describe("GET /api/v1/users/myself", () => {
  beforeEach(async () => {
    await connectDB();
    await initDB();
    dotenv();
  });
  afterAll(() => {});

  test("내 정보 가져오기 테스트", async () => {
    const agent = request.agent(app);
    const joinResponse = await agent
      .post("/api/v1/users/join")
      .send({ nickname: "chulsoo", password: "password" })
      .expect(200);

    expect(joinResponse.body).toEqual({
      code: 200,
      message: "회원가입 성공",
    });

    const loginResponse = await agent
      .post("/api/v1/users/login")
      .send({ nickname: "chulsoo", password: "password" })
      .expect(200);

    expect(loginResponse.body).toEqual({
      code: 200,
      message: "로그인 성공",
    });

    const myInfo = await agent.get("/api/v1/users/myself");
    expect(myInfo.body).toEqual({
      nickname: "chulsoo",
      matches: 0,
      win: 0,
      lose: 0,
    });

    const logoutResponse = await agent.get("/api/v1/users/logout");
    expect(logoutResponse.body).toEqual({
      code: 200,
      message: "로그아웃에 성공했습니다.",
    });

    const myFailInfo = await agent.get("/api/v1/users/myself");
    expect(myFailInfo.body).toEqual({
      code: 401,
      message: "로그인이 필요합니다.",
    });
  });
});
