import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT} 포트 서버 연결`)
})
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'client/build')));
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '/client/build/index.html'));

})
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '/client/build/index.html'));

})