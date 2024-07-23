import app from "../server.js";
import request from "supertest";
import mongoose from "mongoose";
import dirname from "./dirname.cjs";
import path from "path";
import redisClient from "../utils/redis/index.js";

const { __dirname } = dirname;

const fs = require("fs");

const initDB = async () => {
  // mongoDB 초기화
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }

  // redis 초기화.
  await redisClient.flushDb();
};

describe("POST /api/v1/images/", () => {
  const agent = request.agent(app);
  beforeEach(async () => {
    await initDB();
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
  });
  test("이미지 업로드 성공", async () => {
    // const response = await agent.post("/api/v1/images/").attach("file", image).send({
    //     roomId: "abc123",
    //     type: "ATTACK"
    // })
    const response = await agent
      .post("/api/v1/images/")
      .attach(
        "image",
        path.join(__dirname, "..", "..", "client", "public", "copycat.png")
      )
      .field("roomId", "abc123")
      .field("type", "ATTACK");

    expect(response.body).toEqual({ status: 201, roomId: "abc123" });
  });
});

describe("GET /api/v1/images/:roomId", () => {
    const agent = request.agent(app);
    beforeEach(async () => {
      await initDB();
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
    });
    test("이미지 업로드 후 가져오기 성공", async () => {
      const imagePath = path.join(__dirname, "..", "..", "client", "public", "copycat.png")
      const response = await agent
        .post("/api/v1/images/")
        .attach(
          "image",
          imagePath
        )
        .field("roomId", "abc123")
        .field("type", "ATTACK");
  
      expect(response.body).toEqual({ status: 201, roomId: "abc123" });

      // 저장한 이미지 버퍼로 가져오기.
      const getResponse = await agent
      .get("/api/v1/images/abc123");
      expect(getResponse.body).toEqual(fs.readFileSync(imagePath));

    
    });
    test("존재하지 않은 이미지", async ()=>{
      const getResponse = await agent
      .get("/api/v1/images/abc123");
      expect(getResponse.body).toEqual({
        status: 500,
        message: "이미지를 가져오는데 실패했습니다."
      });
        
    })
  });
  