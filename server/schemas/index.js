import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(
    `mongodb://${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`
  );
  console.log("mongodb 연결 성공");

  mongoose.connection.on("error", (error) => {
    console.log(error);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("연결 실패 재연결 시도합니다.");
    // connectDB();
  });
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("mongoDB 연결을 끊었습니다.");
};
export const initDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};