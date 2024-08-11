import { LogArray, LogData, ResultData } from './interfaces/apiTypes';
import { setTask } from './apiClient';
import { getOSName, getBrowserName, getDeviceName } from './useAgent';
import { LocalData } from './interfaces/localData';
import { nowTime } from './utils/time';
import { takeScreenshot } from './screenshot/screenshotUtils';
import { SessionState } from './enums/sessionState';

let savedInfo: LogData[] = [];
let startTime = performance.now();
let sessionState: SessionState;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startSession") {
    console.log("세션을 시작합니다.");
    sessionState = SessionState.Start;

  } else if (message.action === "endSession") {
    console.log("세션을 종료합니다.");
    sessionState = SessionState.End;

  } else if (message.action === "pauseSession") {
    console.log("세션을 일시 정지합니다.");
    sessionState = SessionState.Pause;

  } else if (message.action === "resumeSession") {
    console.log("세션을 계속합니다.");
    sessionState = SessionState.Resume;
  }
});

const getIdsInLocal = () => {
  const keys = ['userId', 'userAge', 'userGender', 'userCountry', 'projectId', 'testId', 'taskId', 'fragment'];
  const result = chrome.storage.local.get(keys);
  return result;
};

/**
 * 탭 업데이트 이벤트 리스너를 등록.
 * 탭의 상태가 'complete'인 경우, 해당 탭에 메시지를 전송하여 리스너를 다시 초기화함.
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  /**
   * 탭의 로딩이 완료된 경우 실행.
   * @param {number} tabId - 업데이트된 탭의 ID.
   * @param {object} changeInfo - 탭의 변경 정보 객체.
   * @param {object} tab - 업데이트된 탭 객체.
   */
  if (changeInfo.status === 'complete') {
    console.log("탭 로드 완료, 탭 ID: ", tabId);
    try {
      chrome.tabs.sendMessage(tabId, { action: 'reInitiateListeners', sessionState: sessionState }, function (response) {
        if (chrome.runtime.lastError) {
          console.error("메시지 전송 중 에러 발생: ", chrome.runtime.lastError.message);
        } else {
          console.log("URL 전송 완료, 응답: ", response);
        }
      });
    } catch (error) {
      console.error("메시지 전송 중 예외 발생: ", error);
    }
  }
});

//백그라운드 스크립트에 로그 데이터 저장
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "logData") {
    savedInfo.push(message.data);
  }
});

/**
 * 백그라운드 스크립트에서 메시지를 수신하고 처리하는 이벤트 리스너를 등록.
 * savedInfo를 요청하는 메시지를 수신하면, savedInfo 데이터를 응답으로 전송함.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  /**
   * 메시지의 액션이 'requestSavedInfo'인지 확인.
   * @param {object} request - 수신된 메시지 객체.
   * @param {object} sender - 메시지를 보낸 객체 (탭, 확장 프로그램 등).
   * @param {function} sendResponse - 응답을 보낼 함수.
   */
  if (request.action === "requestSavedInfo") {
    // savedInfo 데이터를 응답으로 전송
    sendResponse({ data: savedInfo });
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  if (message.action === 'takeScreenshot') {
    console.log("contentScript.ts로부터 background.ts로 메시지를 전송받음/ 현재화면을 base64형태로 캡쳐");
    takeScreenshot(message, sender);
  }

  // background 스크립트에서 메시지를 수신하고 처리하는 코드
  if (message.action === 'addlogInfo') {
    // savedInfo 배열이 비어있는 경우 테스크 시작 시간을 측정
    if (savedInfo.length < 1) {
      startTime = performance.now();
    }
    // 응답을 보내어 메시지 핸들러가 완료되었음을 알림
    sendResponse({});
  }

  if (message.action === 'clearAllInfos') {
    savedInfo = [];
  }

  if (message.action === 'sendlogInfos') {
    savedInfo = message.data;

    console.log("savedInfo: ", savedInfo);

    const durationSec = (performance.now() - startTime) / 1000;
    const osName = getOSName();
    const browserName = getBrowserName();
    const deviceName = getDeviceName();

    const { userId, userAge, userGender, userCountry, projectId, testId, taskId, fragment } =
      await getIdsInLocal();

    const resultData: ResultData = {
      os: osName,
      browser: browserName,
      device: deviceName,
      durationSec: durationSec,
      successRate: 50,
      userId: userId,
      userAge: userAge,
      userGender: userGender,
      userCountry: userCountry,
      isFinished: message.isFinished,
      accessedAt: nowTime(),
    };

    await setTask(
      { data: savedInfo, result: resultData } as LogArray,
      projectId,
      testId,
      taskId
    );

    sendResponse({ data: savedInfo });
    savedInfo = [];
  }
});
