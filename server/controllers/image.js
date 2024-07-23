import redisClient from "../utils/redis/index.js";

export const uploadImage = async (req, res) => {
  const imgBuffer = req.file.buffer;
  const imgBase64 = imgBuffer.toString("base64"); // Buffer를 Base64 문자열로 변환
  const {roomId, type} = req.body;
  try {
    const exists = await redisClient.exists(roomId);
    // roomId key 값이 존재하지 않는다면 새로 객체를 만들어서 넣어준다.
    if (!exists){
      await redisClient.set(roomId, JSON.stringify({
        attack: imgBase64
      }))
    }

    // 존재한다면 객체를 가져와서 type에 맞게 세팅.
    else{
      const imgObjectString = await redisClient.get(roomId);
      const imgObject = JSON.parse(imgObjectString);
      if (type === "ATTACK"){
        imgObject.attack = imgBase64;
      } else{
        imgObject.defense = imgBase64;
      }
      // 객체를 다시 저장
      await redisClient.set(roomId, JSON.stringify(imgObject));
    }
    res.send({ 
        status: 201,
        roomId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: 500,
      message: "이미지 저장에 실패했습니다.",
    });
  }
};

export const getImage = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    // JSON parse해서 attack 정보만 가져옴.
    // defense는 가져올 필요 없음.
    const exists = await redisClient.exists(roomId);

    const imgObjectString = await redisClient.get(roomId);
    const imgObject = JSON.parse(imgObjectString);
    const imgBase64 = imgObject.attack;
    if (!imgBase64) {
      return res.status(404).send({
        status: 404,
        message: "이미지를 찾을 수 없습니다.",
      });
    }

    const imgBuffer = Buffer.from(imgBase64, "base64"); // Base64 문자열을 Buffer로 변환

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": imgBuffer.length,
    });
    res.end(imgBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: 500,
      message: "이미지를 가져오는데 실패했습니다.",
    });
  }
};
