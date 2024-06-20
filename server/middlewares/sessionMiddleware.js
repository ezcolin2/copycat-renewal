import session from 'express-session';
import dotenv from '../config/dotenv/index.js';
dotenv();
const sessionMiddleware = session({
    cookie: {
        path: "/", // 쿠키 저장 경로.
        httpOnly: true, // 클라이언트가 자바스크립트를 통해 쿠키 접근 불가.
        secure: false, // https에서만 사용 여부. 로컬에서 http로 테스트 할 예정이므로 false.
        maxAge: null // 만료 시간. null이면 무한
    },
    secure: false, // https에서만 사용 여부. 로컬에서 http로 테스트 할 예정이므로 false.
    secret: process.env.SECRET_KEY, // 시크릿 키. 
    saveUninitialized: false, // 세션이 변경되지 않았을 때 세션은 초기화 되지 않지만 true로 두면 초기화 됨. 
    resave: false // 변경 사항이 없어도 항상 세션을 저장할지
})
export default sessionMiddleware