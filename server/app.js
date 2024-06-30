import app from './server.js';
import socketConnect from './socket/socket.js';
const server = app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT} 포트 서버 연결`);
})
socketConnect(server);