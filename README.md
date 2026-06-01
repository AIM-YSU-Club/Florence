### Florence
#### 기후 변화 기반 의약품 수요 예측 플랫폼
Florence는 기후 데이터를 분석하여 의약품 수요를 예측하고, 약국 점주에게 최적의 발주량을 제안하는 웹 애플리케이션입니다. 프로젝트명은 근대 간호학의 창시자이자 데이터 시각화의 선구자인 **Florence Nightingale**에서 따왔습니다.

* * *

### ✨ 주요 기능

* 기후 변화 데이터를 기반으로 한 의약품 수요 예측
* 약국 점주를 위한 발주량 조언 (과발주 / 추가 발주 필요 여부)
* 예측 결과를 직관적인 UI로 시각화

* * *

### 🏗️ 아키텍처
Florence는 프론트엔드와 백엔드가 분리된 구조로 운영됩니다.

|역할|레포지토리|기술스택|
|:---|:---|:---|
|Frontend|Florence|React, Typescript, Vite|
|Backend|FlorenceCore|Python, ML|

* * *

### 🚀 실행 방법
#### 1. 레포지토리 클론
```bash
git clone https://github.com/AIM-YSU-Club/Florence.git
```
#### 2. 패키지 설치
```bash
# Yarn (기본)
yarn install

# 또는 npm
npm install
```

#### 3. 개발 서버 실행
```bash
# Yarn (기본)
yarn dev

# 또는 npm
npm run dev
```
* * *
### 🌐 배포
https://florence-ten-drab.vercel.app
* * *
### 👥 팀
AIM-YSU-Club — 대학 공학회 소속 개발팀
