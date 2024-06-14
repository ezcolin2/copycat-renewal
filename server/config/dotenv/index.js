import dotenv from "dotenv";

export default ()=>{
  switch (process.env.NODE_ENV) {
    case "dev":
      dotenv.config({ path:"./config/dotenv/dev.env" });
      break;
    case "test":
      dotenv.config({ path: "./config/dotenv/test.env"});
      break;
    default: // 기본적으로 개발 모드
      dotenv.config({ path: "./dev.env"});
      break;
  }
  console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
}
