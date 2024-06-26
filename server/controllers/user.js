import User from '../schemas/user.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

export const joinUser = async (req, res) => {
  console.log(req.body);
  const { nickname, password } = req.body;
  const newUser = new User({
    nickname,
    password: await bcrypt.hash(password, 10),
  });
  try {
    await newUser.save();
  } catch (error) {
    if (error.name == "MongoServerError" && error.code == 11000) {
      return res.status(409).json({
        code: 409,
        message: "유저 이름 중복",
      });
    } else if (error.name == "ValidationError"){
      console.log(error.message);
      return res.status(409).json({
        code: 400,
        message: error.message,
      });

    }
    console.log(error.name);
    console.log(error.code);
  }
  res.status(200).json({
    code: 200,
    message: "회원가입 성공",
  });
};

export const loginUser = async (req, res, next) => {
    
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (!user) {
      return res.status(info.code).json(info);
    }
    return req.login(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.status(info.code).json(info);
    });
  })(req, res, next);
};

export const getMyInfo = (req, res)=>{
  const user = req.user;
  res.status(200).json({
    nickname: user.nickname,
    matches: user.matches,
    win: user.win,
    lose: user.lose
  });
}

export const logoutUser = (req, res) => {
  if (!req.user){
    res.status(401).json({
      code: 401,
      message: "접근 권한이 없습니다.",
    });
    return;
  }
  req.session.destroy();
  res.status(200).json({
    code: 200,
    message: "로그아웃에 성공했습니다.",
  });
};

