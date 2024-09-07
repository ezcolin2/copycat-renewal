import app from "../server.js";
import request from "supertest";
import mongoose from "mongoose";
import dirname from "./dirname.cjs";
import path from "path";
import redisClient from "../utils/redis/index.js";
import { connectDB, disconnectDB } from "../schemas/index.js";
import dotenv from "../config/dotenv/index.js";

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
    await connectDB();
    await initDB();
    dotenv();
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
    await connectDB();
    await initDB();
    dotenv();
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
    const imagePath = path.join(
      __dirname,
      "..",
      "..",
      "client",
      "public",
      "copycat.png"
    );
    const response = await agent
      .post("/api/v1/images/")
      .attach("image", imagePath)
      .field("roomId", "abc123")
      .field("type", "ATTACK");

    expect(response.body).toEqual({ status: 201, roomId: "abc123" });

    // 저장한 이미지 버퍼로 가져오기.
    const getResponse = await agent.get("/api/v1/images/abc123");
    expect(getResponse.body).toEqual(fs.readFileSync(imagePath));
  });
  test("존재하지 않은 이미지", async () => {
    const getResponse = await agent.get("/api/v1/images/abc123");
    expect(getResponse.body).toEqual({
      status: 500,
      message: "이미지를 가져오는데 실패했습니다.",
    });
  });
});

describe("GET /api/v1/images/poses/:roomId", () => {
  const poseObject = {
    score: 0.4886581509867135,
    keypoints: [
      {
        score: 0.9998289346694946,
        part: "nose",
        position: {
          x: 437.9308274562257,
          y: 261.28188077577823,
        },
      },
      {
        score: 0.9998694658279419,
        part: "leftEye",
        position: {
          x: 481.01418105544747,
          y: 241.61907982733464,
        },
      },
      {
        score: 0.9997023940086365,
        part: "rightEye",
        position: {
          x: 420.6393634484436,
          y: 225.06913834508754,
        },
      },
      {
        score: 0.9647476077079773,
        part: "leftEar",
        position: {
          x: 515.799717290856,
          y: 272.65488205252916,
        },
      },
      {
        score: 0.538020133972168,
        part: "rightEar",
        position: {
          x: 380.47828763375486,
          y: 230.1960534715467,
        },
      },
      {
        score: 0.9695342183113098,
        part: "leftShoulder",
        position: {
          x: 532.0104267996109,
          y: 376.8582046449416,
        },
      },
      {
        score: 0.9865678548812866,
        part: "rightShoulder",
        position: {
          x: 290.8150687013619,
          y: 342.13939384727627,
        },
      },
      {
        score: 0.23598776757717133,
        part: "leftElbow",
        position: {
          x: 557.3168090345331,
          y: 504.8697410019455,
        },
      },
      {
        score: 0.6192570328712463,
        part: "rightElbow",
        position: {
          x: 198.14192834995137,
          y: 494.14381687743196,
        },
      },
      {
        score: 0.481830358505249,
        part: "leftWrist",
        position: {
          x: 486.3888846668288,
          y: 413.0344494771401,
        },
      },
      {
        score: 0.08591008186340332,
        part: "rightWrist",
        position: {
          x: 495.742719479572,
          y: 421.6360271765564,
        },
      },
      {
        score: 0.12907938659191132,
        part: "leftHip",
        position: {
          x: 480.5051906006809,
          y: 567.1669807879377,
        },
      },
      {
        score: 0.11403948813676834,
        part: "rightHip",
        position: {
          x: 340.7536630593385,
          y: 564.257280520428,
        },
      },
      {
        score: 0.06168632581830025,
        part: "leftKnee",
        position: {
          x: 554.8618753039883,
          y: 480.5636323565175,
        },
      },
      {
        score: 0.03498431295156479,
        part: "rightKnee",
        position: {
          x: 269.3264568640564,
          y: 321.8046647008755,
        },
      },
      {
        score: 0.048109885305166245,
        part: "leftAnkle",
        position: {
          x: 555.70445494893,
          y: 508.3099008998055,
        },
      },
      {
        score: 0.038033317774534225,
        part: "rightAnkle",
        position: {
          x: 513.7957882417315,
          y: 511.45606608706225,
        },
      },
    ],
  };
  const agent = request.agent(app);
  beforeEach(async () => {
    await connectDB();
    await initDB();
    dotenv();
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
  test("포즈 객체 업로드 후 가져오기 성공", async () => {
    const response = await agent.post("/api/v1/images/poses").send({
      roomId: 123,
      type: "ATTACK",
      poseObject,
    });
    expect(response.body).toEqual({
      status: 201,
      roomId: 123,
    });

    // 저장한 포즈 객체 가져오기.
    const getResponse = await agent.get("/api/v1/images/poses/123");
    console.log(getResponse.body);
    expect(getResponse.body).toEqual({
      status: 200,
      res: {
        attack: poseObject,
      },
    });

    // expect(response.body).toEqual({ status: 201, roomId: "abc123" });

    // // 저장한 이미지 버퍼로 가져오기.
    // const getResponse = await agent.get("/api/v1/images/abc123");
    // expect(getResponse.body).toEqual(fs.readFileSync(imagePath));
  });
  test("존재하지 않은 이미지", async () => {
    const getResponse = await agent.get("/api/v1/images/abc123");
    expect(getResponse.body).toEqual({
      status: 500,
      message: "이미지를 가져오는데 실패했습니다.",
    });
  });
});
