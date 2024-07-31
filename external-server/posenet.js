import { poseSimilarity } from "posenet-similarity";
import {
  dequeueData,
  isQueueEmpty,
} from "./redis/redisQueue.js";
import express from "express";
import redisClient from "./redis/index.js";

const app = express();
app.get("/api/v1/images/:roomId", async (req, res) => {
  console.log(req.params.roomId);
  if (isQueueEmpty(req.params.roomId)) {
    res.status(404).send({
      code: 404,
      message: `${req.params.roomId}에 해당하는 데이터가 없습니다.`,
    });
  }
  const data = await dequeueData(req.params.roomId);
  console.log(data);
});
app.get("/api/v1/pose-similarity/:roomId", async (req, res) => {
  if (isQueueEmpty(req.params.roomId)) {
    return res.status(404).send({
      code: 404,
      message: `${req.params.roomId}에 해당하는 데이터가 없습니다.`,
    });
  }
  const object = await redisClient.get(req.params.roomId);
  const objectJSON = JSON.parse(object);
  const weightedDistance = poseSimilarity(objectJSON.attack, objectJSON.defense);
  res.status(200).send({
    status: 200,
    res: weightedDistance,
    message: "두 포즈의 유사도를 계산했습니다."
  });
});

app.listen(3002, () => {
  console.log(`3002 포트 서버 연결`);
});
export default app;
