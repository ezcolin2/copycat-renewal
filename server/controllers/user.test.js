jest.mock("../schemas/user.js");
import User from "../schemas/user.js";
import bcrypt from "bcrypt";
jest.mock("passport");
import passport from "passport";
import { joinUser, loginUser, logoutUser, getMyInfo } from "./user.js";
describe("joinUser", () => {
  test("회원가입 성공", async () => {
    User.prototype.save = jest.fn().mockResolvedValue({
      nickname: "chulsoo",
      password: "password",
    });
    const req = {
      body: {
        nickname: "chulsoo",
        password: "password",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(() => {}),
    };
    await joinUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      code: 200,
      message: "회원가입 성공",
    });
  });
  test("회원가입 실패 유저 닉네임 중복", async () => {
    User.prototype.save = jest.fn().mockRejectedValue({
      name: "MongoServerError",
      code: 11000,
    });
    const req = {
      body: {
        nickname: "chulsoo",
        password: "password",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(() => {}),
    };
    await joinUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      code: 409,
      message: "유저 이름 중복",
    });
  });
});

describe("loginUser", () => {
  const req = {
    body: {
      nickname: "chulsoo",
      password: "password",
    },
    login: jest.fn((user, callback) => {
      callback();
    }),
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("로그인 성공", async () => {
    passport.authenticate.mockImplementationOnce(
      (strategy, callback) => (req, res, next) => {
        callback(
          null,
          { nickname: "chulsoo", password: "password" },
          { code: 200, message: "로그인 성공" }
        );
      }
    );

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      code: 200,
      message: "로그인 성공",
    });
  });
  test("로그인 실패", async () => {
    passport.authenticate.mockImplementationOnce(
      (strategy, callback) => (req, res, next) => {
        callback(null, false, {
          code: 400,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }
    );

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      message: "비밀번호가 일치하지 않습니다.",
    });
  });
});

describe("logoutUser", () => {
  const req = {
    session: {
      destroy: jest.fn(),
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  logoutUser(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    code: 200,
    message: "로그아웃에 성공했습니다.",
  });
  describe("getMyInfo", () => {
    const req = {
      user: {
        nickname: "chulsoo",
        password: "password",
        matches: 10,
        win: 5,
        lose: 5
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    test('내 정보 가져오기', async ()=>{
      getMyInfo(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        nickname: "chulsoo",
        matches: 10,
        win: 5,
        lose: 5
      })
    })
    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
