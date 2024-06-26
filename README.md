# Copy Cat 게임 알고리즘

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
