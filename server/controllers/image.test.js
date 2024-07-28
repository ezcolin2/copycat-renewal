jest.mock("../utils/redis/index");
import { uploadImage, getImage, uploadPoseObject } from "./image.js";
import redisClient from "../utils/redis/index";

describe("uploadImage 테스트", () => {
  const req = {
    file: {
      buffer: Buffer.from("test"),
    },
    body: {
      roomId: "abc123",
      type: "ATTACK",
    },
  };
  const res = {
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  test("이미지 저장 시 이미지 아이디 반환", async () => {
    await uploadImage(req, res);

    // expect(redisClient.set).toHaveBeenCalledWith(imageId, expect.any(String));
    expect(res.send).toHaveBeenCalledWith({ status: 201, roomId: "abc123" });
  });
  test("이미지 저장에 실패하면 이미지 저장 실패 메시지 반환", async () => {
    redisClient.set.mockRejectedValueOnce(new Error());

    await uploadImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: 500,
      message: "이미지 저장에 실패했습니다.",
    });
  });
});

describe("getImage 테스트", () => {
  const req = {
    params: {
      roomId: "testImageId",
    },
  };
  const res = {
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
    writeHead: jest.fn(),
    end: jest.fn(),
  };

  test("이미지 가져오기 성공", async () => {
    // 이미지를 base64 문자열 형태로 변환
    const imgBase64 = Buffer.from("testImageId").toString("base64");
    redisClient.get.mockResolvedValue(
      JSON.stringify({
        image: imgBase64,
      })
    );

    await getImage(req, res);

    // base64 문자열을 버퍼로 변경
    const imgBuffer = Buffer.from(imgBase64, "base64");
    expect(redisClient.get).toHaveBeenCalledWith("testImageId");
    expect(res.writeHead).toHaveBeenCalledWith(200, {
      "Content-Type": "image/png",
      "Content-Length": imgBuffer.length,
    });
    expect(res.end).toHaveBeenCalledWith(imgBuffer);
  });

  test("이미지 아이디를 찾을 수 없음", async () => {
    // null 반환
    redisClient.get.mockResolvedValue(JSON.stringify({}));

    await getImage(req, res);

    expect(redisClient.get).toHaveBeenCalledWith("testImageId");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      status: 404,
      message: "이미지를 찾을 수 없습니다.",
    });
  });

  test("레디스 내부 오류 발생", async () => {
    redisClient.get.mockRejectedValueOnce(new Error());

    await getImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: 500,
      message: "이미지를 가져오는데 실패했습니다.",
    });
  });
});
describe("uploadPoseObject 테스트", () => {
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
  const req = {
    body: {
      roomId: "abc123",
      type: "ATTACK",
      poseObject
    },
  };
  const res = {
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
  test("uploadPoseObject 성공", async ()=>{
    await uploadPoseObject(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      status: 201,
      roomId: req.body.roomId
    });
  })
});
