import { OpenVidu } from "openvidu-node-client";

import dotenv from '../config/dotenv/index.js';
dotenv();
console.log(process.env.OPENVIDU_URL)
console.log(process.env.OPENVIDU_SECRET)
const openvidu = new OpenVidu(
  process.env.OPENVIDU_URL,
  process.env.OPENVIDU_SECRET
);
export const createSession = async (req, res) => {
  const session = await openvidu.createSession(req.body);
  console.log("openvidu session : ", session);
  res.json({
    status: 200,
    message: `화상 통화 세션을 생성했습니다.`,
    sessionId: session.sessionId,
  });
};

export const enterSession = async (req, res) => {
  const session = openvidu.activeSessions.find(
    (s) => s.sessionId === req.params.sessionId
  );
  if (!session){
    res.status(404).json({
        status: 404,
        message: '세션을 찾을 수 없습니다.',
        sessionId: req.params.sessionId
    });
  }
  else{
    const connection = await session.createConnection(req.body);
    res.status(200).json({
        status: 200,
        message: '화상 통화 세션에 연결되었습니다.',
        token: connection.token
    })
  }
};
