import redisClient from "./index.js";

import {
  createQueue,
  enqueueData,
  dequeueData,
  isQueueEmpty,
  deleteQueue,
} from "./redisQueue.js";

describe("큐 테스트", () => {
    
  test("큐 생성 테스트", async () => {
    const roomId = "roomId";
    await deleteQueue(roomId);
    await createQueue(roomId); // 큐 생성
    await enqueueData(roomId, {
      nickname: "chulsoo",
      role: "attack",
    });
    const turnInfo = await dequeueData(roomId);
    expect(turnInfo).toEqual({
      nickname: "chulsoo",
      role: "attack",
    });

    const isEmpty = await isQueueEmpty(roomId);
    expect(isEmpty).toBe(true);
  });
});
