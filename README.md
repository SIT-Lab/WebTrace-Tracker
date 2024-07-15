# <img src="public/icons/logo.png" width="45" align="left"> Sitlab Test Tracker


<p align="center">
  <img src="https://img.shields.io/badge/firebase-v9.23.0-FFCA28?logo=firebase" alt="firebase" />
  <img src="https://img.shields.io/badge/typescript-v5.2.2-3178C6?logo=typescript" alt="typescript" />
</p>

Sitlab Test Tracker는 전북대학교 소프트웨어 인터랙션 연구실에서 개발한 웹 애플리케이션 인터랙션 추적 도구입니다. 이 도구는 크롬 확장 프로그램 형태로 제공되며, 사용자의 웹 애플리케이션 인터랙션을 원격으로 추적합니다. 추적되는 데이터에는 접속한 URL, Task 수행시간, 클릭, 스크롤, 키보드 입력 등이 있으며, 이 데이터는 파이어베이스에 기록됩니다. 수집된 데이터는 웹 애플리케이션의 사용성을 분석하고 개선하는 데 사용될 수 있습니다.

## 팀원
| **편지승**  | **허민**    |
|:-----------:|:-----------:|
| <img src="https://avatars.githubusercontent.com/vuswltmd" height="130" width="130"></img> | <img src="https://avatars.githubusercontent.com/i-mymeminn" height="130" width="130"></img> |
| <a href="https://github.com/vuswltmd" target="_blank"><img src="https://img.shields.io/badge/GitHub-black.svg?&style=round&logo=github&logoColor=white"/></a> | <a href="https://github.com/i-mymeminn" target="_blank"><img src="https://img.shields.io/badge/GitHub-black.svg?&style=round&logo=github&logoColor=white"/></a> |
| <a href="mailto:sseung7367@jbnu.ac.kr" target="_blank"><img src="https://img.shields.io/badge/Gmail-EA4335?style=round&logo=Gmail&logoColor=white"/></a> | <a href="mailto:heomin02@jbnu.ac.kr" target="_blank"><img src="https://img.shields.io/badge/Gmail-EA4335?style=round&logo=Gmail&logoColor=white"/></a> |

## 시스템 아키텍쳐
<작성예정>

## 사용방법

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7aff353-c6c2-4fc5-9eaf-a79e7d975416" width="240" alt="image1" style="margin-right: 15px;"/>
  <img src="https://github.com/user-attachments/assets/77db0423-854e-4f01-affa-f5b3d8de5d13" width="240" alt="image2" style="margin-right: 15px;"/>
  <img src="https://github.com/user-attachments/assets/eeb0df6c-3bf1-4e53-af12-37beb2843553" width="240" alt="image3" style="margin-right: 15px;"/>
  <img src="https://github.com/user-attachments/assets/bede501b-0a3d-456d-8f3a-5eb6cf8e53a3" width="240" alt="image4"/>
</p>

### A. Task 정보 입력
테스터로부터 발급받은 정보를 입력하는 화면입니다
- 테스터로부터 발급받은 Project ID, Test ID, Task ID를 입력합니다
- 정보를 올바르게 입력한 후 Submit 버튼을 눌러 다음 페이지로 이동합니다
### B. 사용자 정보 입력
Task에 참여하는 사용자의 정보를 입력하는 화면 입니다
- 사용자 ID, 나이, 성별, 국적을 입력합니다
- 정보를 올바르게 입력한 후 Submit 버튼을 눌러 다음 페이지로 이동합니다
### C. Task 시작 화면
Task의 시작여부를 결정하는 화면입니다
- 주의사항 알림 메세지를 확인합니다
- Click to Start 버튼을 클릭하여 Task를 시작할 수 있습니다
- Task가 시작되면 현재 활성화된 크롬 브라우저 탭과 사용자 간의 인터랙션이 추적됩니다.
### D Task 종료 유형 결정
Task의 종료유형을 결정하는 화면입니다.
- Finish: Task를 수행완료하였으며 추적된 인터랙션 데이터를 파이어베이스에 저장하고자 하는 경우 클릭합니다.
Task는 종료됩니다.
- Give up: Task를 수행하지 못했다고 판단하여 도중 포기하는 경우 클릭합니다. 포기하기 전까지 추적된 인터랙션 데이터가 파이어베이스에 저장됩니다.
- Pause: 테스트 도중 인터랙션 추적을 일시 정지하려는 경우 클릭합니다. 클릭하면 버튼의 텍스트가 Continue로 변경되며 추적이 중단됩니다. 이때 Continue 버튼을 클릭하면 버튼의 텍스트가 다시 Pause로 변경되고 인터랙션 데이터 추적이 재개됩니다.
- Quit: Task의 수행 완료 여부와 상관없이 Task를 종료하고 추적된 데이터를 폐기하려는 경우 클릭합니다.


## 설치방법

1. **코드 클론:**
   - 먼저, GitHub에서 이 프로젝트의 코드를 클론합니다.
   ```sh
    git clone [https://github.com/SIT-Lab/sitlab-test-tracker.git]
    cd [저장소 폴더 이름]
   ```
2. **환경 변수 설정:**
    - 프로젝트의 루트 디렉토리에 .env 파일을 생성하고, 다음 내용을 추가합니다. Firebase 콘솔에서 발급받은 값을 넣어주세요
    ```sh
    REACT_APP_FIREBASE_API_KEY=발급받아서_넣어주세요
    REACT_APP_FIREBASE_AUTH_DOMAIN=발급받아서_넣어주세요
    REACT_APP_FIREBASE_PROJECT_ID=발급받아서_넣어주세요
    REACT_APP_FIREBASE_STORAGE_BUCKET=발급받아서_넣어주세요
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=발급받아서_넣어주세요
    REACT_APP_FIREBASE_APP_ID=발급받아서_넣어주세요
    REACT_APP_FIREBASE_MEASUREMENT_ID=발급받아서_넣어주세요
    ```
2. **필수 패키지 설치:**
   - 프로젝트의 루트 디렉토리에서 npm을 사용하여 필요한 패키지를 설치합니다.
   ```sh
    npm install
   ```
3. **프로젝트 빌드:** 
    - 프로젝트의 루트 디렉토리에서 npm을 사용하여 필요한 패키지를 설치합니다.
   ```sh
    npm run build
   ```

4. **크롬 확장 프로그램 업로드:** 

    - 크롬 브라우저를 열고, 주소창에 chrome://extensions/를 입력하여 확장 프로그램 관리 페이지로 이동합니다.
    - 우측 상단의 개발자 모드를 활성화합니다.
    - 압축 해제된 확장 프로그램 로드 버튼을 클릭합니다.
    - build 폴더를 선택하여 업로드합니다
    - 확장 프로그램이 크롬에 설치되고 사용 가능합니다.

## 라이센스

이 프로젝트는 Apache License 2.0 라이센스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하십시오.

이 프로젝트에는 다음과 같은 Apache License 2.0 라이센스를 따르는 서드파티 라이브러리가 포함되어 있습니다. 자세한 내용은 [NOTICE](NOTICE) 파일을 참조하십시오.