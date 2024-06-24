import app from "../server.js";
import request from "supertest";

describe('/POST /api/v1/openvidu/connections', ()=>{
    test('openvidu 세션 생성 테스트', async ()=>{
        const agent = request.agent(app);
        const joinResponse = await agent
          .post("/api/v1/users/join")
          .send({ nickname: "jinsoo", password: "password" })
          .expect(200);
    
        expect(joinResponse.body).toEqual({
          code: 200,
          message: "회원가입 성공",
        });
        
        const loginResponse = await agent
          .post("/api/v1/users/login")
          .send({ nickname: "jinsoo", password: "password" })
          .expect(200);
    
        expect(loginResponse.body).toEqual({
          code: 200,
          message: "로그인 성공",
        });

        const response = await agent.post('/api/v1/openvidu/connections').send({
            sessionId: "sessionId"
        })
        
        expect(response.body).toEqual({
            status: 200,
            message: `화상 통화 세션을 생성했습니다.`,
            sessionId: "sessionId"
        })
    })
})