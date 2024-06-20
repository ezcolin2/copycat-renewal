import express from 'express'
import userRouter from './routes/user.js';
import cors from 'cors';
import session from 'express-session';
import passportConfig from './passport/index.js';
import passport from 'passport';
import dotenv from './config/dotenv/index.js';
import sessionMiddleware from './middlewares/sessionMiddleware.js';
import {connect} from './schemas/index.js'
connect();
dotenv();
const app = express()
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(sessionMiddleware);
passportConfig();
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static('../client/build'));
app.use(cors());
app.get('/', (req, res)=>{
    res.sendFile('../client/build/index.html');

})
app.use('/api/v1/users', userRouter);
app.get('*', (req, res)=>{
    res.sendFile('../client/build/index.html');

})

export default app;