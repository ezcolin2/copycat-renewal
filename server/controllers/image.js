import redisClient from "../utils/redis/index.js";

export const uploadImage = async (req, res) => {
  const imgBuffer = req.file.buffer;
  const imageId = Date.now().toString(); // 이미지 ID 생성 (예: 타임스탬프)
  const imgBase64 = imgBuffer.toString("base64"); // Buffer를 Base64 문자열로 변환

  try {
    await redisClient.set(imageId, imgBase64);
    res.send({ 
        status: 201,
        imageId 
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
  const imageId = req.params.id;
  try {
    const imgBase64 = await redisClient.get(imageId);
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
