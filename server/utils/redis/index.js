import { createClient } from 'redis';

// Redis 클라이언트 생성
const redisClient = createClient({
  host: 'localhost',
  port: '6379',
});

redisClient.on('ready', ()=>{
  console.log('redis 연결 성공')
})
redisClient.on('error', (error) => {
  console.error(error);
});

// Redis 클라이언트 연결
redisClient.connect();

export default redisClient;
