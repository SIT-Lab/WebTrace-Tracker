import { LogData } from './interfaces/apiTypes';
import { onWheel } from './event_tracking/scrollTracking';
import { onKeyboard } from './event_tracking/keyboardInputTracking';
import { onMouse } from './event_tracking/clickTracking';
import { wheelClick } from './event_tracking/wheelClickTracking';
import { uploadBase64ToStorage } from './apiClient';
import { SessionState } from './enums/sessionState';


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  if (request.action === 'reInitiateListeners') {
    if (request.sessionState === SessionState.Start || request.sessionState === SessionState.Resume) {
      "URL이 변경될 때 SessionState에 따라 추적 여부를 결정합니다: 현재 추적 중"
      toggleEventListeners(true);
    }
  }

  switch (request.action) {
    case 'startSession':
      startSession(); // 세션 시작
      addlogInfo(); // 로그 정보 추가
      break;
    case 'finishSession':
      await endSession(true, true); // 세션 완료 및 로그 저장
      break;
    case 'quitSession':
      if (request.isSave == 'false') {
        await endSession(false, false); // 세션 종료 및 로그 미저장
      } else if (request.isSave == 'true') {
        await endSession(false, true); // 세션 종료 및 로그 저장
      }
      break;
    case 'pauseSession':    // 일시 중지 메시지 수신
      await pauseSession(true);  // 일시 중지 기능 실행
      break;
    case 'resumeSession': //Resume 메시지 수신
      await pauseSession(false);  // Resume 기능 실행
      break;
    default:
      break;
  }
});

//마우스 좌클릭
const onMouseEvent = (e: MouseEvent) => {
  onMouse('left click', e);
};

//마우스 우클릭
const onContextMenu = (e: MouseEvent) => {
  if ((e.button == 2)) {
    onMouse('right click', e);
  }
};

//휠 클릭 이벤트
const onWheelClick = (e: MouseEvent) => {
  if ((e.button == 1)) {
    e.preventDefault(); // 기본 동작 방지
    wheelClick('wheel click', e);
  }
}

//마우스 휠(스크롤) 이벤트
const onWheelEvent = (e: WheelEvent) => {
  onWheel(e);
};

//키보드 이벤트
const onKeyboardEvent = (e: KeyboardEvent) => {
  onKeyboard(e);
};

function toggleEventListeners(isAdd: boolean) {
  if (isAdd) {
    document.addEventListener('click', onMouseEvent);
    document.addEventListener('mousedown', onContextMenu);
    document.addEventListener('mousedown', onWheelClick); // 휠 클릭 이벤트 추가
    document.addEventListener('wheel', onWheelEvent);
    document.addEventListener('keydown', onKeyboardEvent);
  } else {
    document.removeEventListener('click', onMouseEvent);
    document.removeEventListener('mousedown', onContextMenu);
    document.removeEventListener('mousedown', onWheelClick); // 휠 클릭 이벤트 제거
    document.removeEventListener('wheel', onWheelEvent);
    document.removeEventListener('keydown', onKeyboardEvent);
  }
}

function startSession() {
  console.log('session start');
  chrome.runtime.sendMessage({ action: "startSession" });
  toggleEventListeners(true); // 마우스, 키보드 이벤트 리스너 등록
}

/**
 * 세션을 종료하는 함수.
 * @param {boolean} isFinished - 세션이 완료되었는지 여부.
 * @param {boolean} isSave - 로그를 저장할지 여부.
 */
async function endSession(isFinished: boolean, isSave: boolean) {
  toggleEventListeners(false); // 이벤트 리스너 해제
  if (isSave) {
    console.log('session end and log is saved');
    sendlogInfos(isFinished, isSave); // 로그 정보를 저장
  } else {
    console.log('session end and log is not saved');
    clearMouseInfos(); // 로그 정보를 저장하지 않음
  }
  chrome.runtime.sendMessage({ action: "pauseSession" }); // 세션을 일시 중지하도록 메시지 전송
}

/**
 * 세션을 일시 중지하거나 계속하는 함수.
 * @param {boolean} isPause - 세션을 일시 중지할지 여부를 나타내는 불리언 값.
 */
async function pauseSession(isPause: boolean) {
  // isPause가 true이면 "pauseSession", false이면 "resumeSession" 액션 설정
  const action = isPause ? "pauseSession" : "resumeSession";
  console.log(`Session ${action}`);

  // 백그라운드 스크립트에 메시지 전송
  chrome.runtime.sendMessage({ action });

  // 이벤트 리스너 해제 또는 재등록
  toggleEventListeners(!isPause);
}

function addlogInfo() {
  chrome.runtime.sendMessage(
    // 기록을 시작한다고 background 스크립트로 신호를 보냄
    { action: 'addlogInfo' },
    (response) => {
      // background 스크립트로부터의 응답을 로그에 기록
      console.log('response.message:', response.message);
    }
  );
}

/**
 * 로그 정보를 전송하는 함수.
 * 세션 종료 시 저장된 로그 정보를 처리하고, 필요한 경우 이미지를 업로드합니다.
 * @param {boolean} isFinished - 세션이 완료되었는지 여부.
 * @param {boolean} isSave - 로그를 저장할지 여부.
 */
async function sendlogInfos(isFinished: boolean, isSave: boolean) {
  // 크롬 익스텐션의 구조로 인해 백그라운드 스크립트로부터 SavedInfo를 전달받음
  // SavedInfo에 저장되어있는 base64를 이미지로 변환시켜야 함
  // 변환한 이미지를 파이어베이스 스토리지에 업로드
  // 업로드한 URL로 imageURL 갱신
  const response = await chrome.runtime.sendMessage({ action: "requestSavedInfo" });
  let savedInfo = response.data;


  // 이미지 업로드를 위한 비동기 함수 배열을 생성
  if (isSave) {

    const uploadPromises = savedInfo.map((info: any) => {
      const randomFileName = `image_${Date.now()}.jpeg`;

      if (info.imageUrl != "캡쳐에러발생" && info.imageUrl) {
        // base64 데이터 URL 형식으로 변환
        const formattedDataUrl = `data:image/jpeg;base64,${info.imageUrl}`;
        return uploadBase64ToStorage(formattedDataUrl, randomFileName)
      } else if (info.imageUrl == "캡쳐에러발생") {
        // imageUrl에 "캡쳐에러발생"이라는 문자열 값이 있다면 해당 값을 그대로 반환하는 Promise 생성
        return Promise.resolve("캡쳐에러발생");
      } else {
        // 이미지 URL이 없는 경우, 빈 문자열을 반환하는 Promise 생성
        return Promise.resolve("");
      }
    });

    // Promise.all을 사용하여 모든 이미지 업로드 작업을 동시에 실행
    const imageURL = await Promise.all(uploadPromises);

    // 모든 이미지가 업로드된 후에 작업을 계속 진행
    if (savedInfo.length === imageURL.length) {
      for (let i = 0; i < savedInfo.length; i++) {
        // 업로드된 이미지 URL을 savedInfo에 갱신
        savedInfo[i].imageUrl = imageURL[i];
        console.log(savedInfo[i].imageUrl)
      }

      // Chrome runtime에 로그 정보를 전송
      chrome.runtime.sendMessage(
        { action: 'sendlogInfos', data: savedInfo, isFinished: isFinished },
        (response) => { }
      );
    }
  } else {
    clearMouseInfos();
  }
}

// quit 버튼을 누르면 파이어베이스로 데이터를 전송하지 않고 저장되어있던 모든 로그를 초기화
function clearMouseInfos() {
  chrome.runtime.sendMessage(
    { action: 'clearAllInfos' },
    (response) => { }
  );
}


// // 클릭한 DOM 엘리먼트를 다시 찾아 빨갛게 표시
// function findClickedElement(xpath: string) {
//   const result = document.evaluate(
//     xpath,
//     document,
//     null,
//     XPathResult.FIRST_ORDERED_NODE_TYPE,
//     null
//   );

//   const selectedElement = result.singleNodeValue as HTMLElement;
//   if (selectedElement) {
//     selectedElement.style.border = '2px solid red';
//   } else {
//     console.log('요소를 찾을 수 없습니다.');
//   }
// }