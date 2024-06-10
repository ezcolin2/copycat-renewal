import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import userRouter from './routes/user.js';
import cors from 'cors';
import session from 'express-session';
import passportConfig from './passport/index.js';
import passport from 'passport';
dotenv.config()
const app = express()
app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT} 포트 서버 연결`);
})
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(session({
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
}))
passportConfig();
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, '..', 'client/build')));
app.use(cors());
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '/client/build/index.html'));

})
app.use('/api/v1/users', userRouter);
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '/client/build/index.html'));

})