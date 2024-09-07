import redisClient from "./index.js";

/**
 * @typedef {Object} TurnInfo
 * @property {string} nickname 현재 턴을 진행 중인 유저 닉네임
 * @property {string} role 현재 턴을 진행 중인 유저의 역할 (공격, 수비)
 */
/**
 * roomId를 key로 하는 새로운 큐 생성 함수.
 * @param {string} roomId 방의 아이디
 * @return {void}
 */
export async function createQueue(roomId) {
  try {
    await redisClient.lPush(roomId, ""); // 빈 값 추가하여 큐 생성
    console.log(
      `[redis] ${roomId} room socket에 빈 값을 추가하여 큐를 생성했습니다.`
    );
  } catch (error) {
    console.error(`Error creating queue for roomId ${roomId}:`, error);
    throw error;
  }
}

/**
 * roomId에 해당하는 큐에 데이터를 추가하는 함수.
 * @param {string} roomId 방의 아이디
 * @param {TurnInfo} turnInfo 현재 턴의 정보
 */
export async function enqueueData(roomId, turnInfo) {
  try {
    console.log(JSON.stringify(turnInfo));
    await redisClient.lPush(roomId, JSON.stringify(turnInfo));
  } catch (error) {
    console.error(
      `[redis] ${roomId} room socket의 데이터를 추가하는데 실패했습니다.`,
      error
    );
    throw error;
  }
}

/**
 * roomId에 해당하는 큐에서 데이터를 제거하고 반환하는 함수.
 * @param {string} roomId 방의 아이디
 * @return {TurnInfo} 현재 턴의 정보
 */
export async function dequeueData(roomId) {
  try {

    const turnInfo = await redisClient.rPop(roomId);
    // 가장 처음에는 빈 값을 저장하기 때문에 만약 빈 값이 나오면 그 다음 값을 반환한다.
    if (turnInfo === "") {
      const newTurnInfo = await redisClient.rPop(roomId);

      return JSON.parse(newTurnInfo);
    } else {
      return JSON.parse(turnInfo);
    }
  } catch (error) {
    console.error(
      `[redis] ${roomId} room socket의 데이터를 빼오는데 실패했습니다.`,
      error
    );
    throw error;
  }
}

/**
 * roomId에 해당하는 큐가 비어 있는지 확인하는 함수.
 * @param {string} roomId 방의 아이디
 * @return {boolean} 큐가 비어있다면 true, 아니라면 false
 */
export async function isQueueEmpty(roomId) {
  try {
    const length = await redisClient.lLen(roomId);
    console.log(`length : ${length}`)
    return length === 0;
  } catch (error) {
    console.error(
      `[redis] ${roomId} room socket의 데이터 확인하는데 실패했습니다.`,
      error
    );
    throw error;
  }
}

/**
 * roomId에 해당하는 큐를 삭제하는 함수.
 * @param {string} roomId 방의 아이디
 * @return {void}
 */
export async function deleteQueue(roomId) {
  try {
    await redisClient.del(roomId);
  } catch (error) {
    console.error(
      `[redis] ${roomId} room socket의 큐를 삭제하는데 실패했습니다.`,
      error
    );
    throw error;
  }
}
