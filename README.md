# Copy Cat 게임

## 실행 방법
기본적으로 클라우드 환경에서 배포하기 위한 프로젝트라서 로컬에서 실행시키기 위해 다음과 같은 과정을 진행해야 한다.

1. docker를 사용하여 openvidu 실행 
```bash
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-dev:2.30.0
```

2. client, server 디렉토리 내부에서 각각 필요한 패키지 설치 
```bash
npm i
```

3. 포즈 유사도 계산을 위한 파이썬 라이브러리 설치
```bash
pip install fastapi uvicorn tensorflow tensorflow-hub pillow numpy
```

4. 포즈 유사도 계산을 위한 fast api 실행 
```bash
uvicorn postCalculateApi:app --reload
```

5. server 디렉토리로 이동 후 npm run dev 실행
```bash
npm run dev
```

## 게임 설명
* 총 두 명이서 게임을 시작한다.
* 각 턴마다 역할은 공격 또는 수비가 존재한다.
* 공격자가 어떠한 포즈를 취하면 수비자는 최대한 그 포즈와 동일하게 포즈를 취해야 점수를 많이 획득할 수 있다.
* [ A 공격 -> B 수비 -> B 공격 -> A 수비 ]의 순서대로 진행한다.
* 가장 점수를 많이 획득한 사람이 승리한다.

## 구체적인 게임 알고리즘
* 게임은 방장이 시작할 수 있으며 첫 번째 공격은 방장이다.
* A가 방장이고 B가 참가자라면 시작 요청이 들어왔을 때 서버의 큐에 [A 공격, B 수비, B 공격, A 수비]을 하나의 라운드로 하고 원하는 라운드만큼 생성한다.
* 큐에서 요소를 하나 꺼내면 방에 참가중인 모두에게 소켓 데이터를 전송한다.
* 참여 중인 유저는 모두 현재 라운드를 진행하는 사람의 video에 타이머를 띄운다.
* 만약 자신이 현재 라운드를 진행하는 사람이라면 타이머를 걸고 정해진 시간 뒤에 자신의 사진을 소켓을 통해 서버로 전송한다.
* 공격자의 사진은 서버의 메모리에 잠시 보관해두고 수비자의 사진이 오면 포즈 유사도를 측정하여 수비자에게 점수를 준다.
* 모든 라운드가 끝나고 서로의 점수를 비교하여 더 높은 점수를 얻은 사람이 승리한다.

## sequence diagram
![image](https://github.com/user-attachments/assets/cf2c5cab-ef30-4688-a54e-2a233614bfbe)

## trouble shooting

### 소켓 통합 테스트 이슈
**[문제 상황]**
jest와 supertest를 사용해서 통합 테스트 코드를 작성하였다.

기능 별로 describe 블록을 나눠서 서버를 실행시키고 있는데 describ 블록 별로 동시에 실행되어 port 번호가 겹쳐 테스트가 제대로 동작하지 않는 이슈가 발생했다.

**[해결 방법]**
describe 별로 api 서버를 실행할 때 포트 번호를 달리한다.

jest를 실행할 때 --runInBand 옵션을 사용하여 병렬 실행을 막는다.

**--runInBand 옵션**
테스트를 실행하는 자식 프로세스의 워커 풀을 만들지 않고 현재 프로세스에서 직렬로 테스트를 수행한다.

