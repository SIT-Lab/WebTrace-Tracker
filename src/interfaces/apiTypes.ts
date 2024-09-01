import { Timestamp } from 'firebase/firestore';

/**
 * LogData 인터페이스: 개별 로그 항목의 속성을 정의
 */
export interface LogData {
  eventType: string;           // 이벤트 타입 (예: wheel, mouseLeftClick, mouseRightClick)
  nodeName: string;            // 노드 이름 (예: h2, div)
  hostName: string;            // URL의 호스트 이름
  pathName: string;            // URL의 경로 이름
  url: string;                 // 전체 URL
  hash: string;                // 이벤트가 발생한 DOM 요소의 고유 해시 코드
  xpath: string;               // 이벤트가 발생한 DOM 요소의 XPath

  /* FIXME: 스크롤 up/down 위치 정보 */
  scrollState?: string;         // 휠 상태 정보 ('scroll start', 'scrolling', 'scroll end', undefined)
  scrollDirection?: string;     // 스크롤 방향 정보
  x?: number;                  // DOM 요소의 X 좌표
  y?: number;                  // DOM 요소의 Y 좌표
  w: number;                   // 이벤트가 발생한 DOM 요소의 너비
  h: number;                   // 이벤트가 발생한 DOM 요소의 높이
  time: any;                   // 이벤트 발생 시간 (타임스탬프)

  /**
   * 키보드의 상태에 대한 정보.
   * 이 상태는 키보드 이벤트의 시작, 진행 중, 종료 중 하나일 수 있음.
   * 가능한 값:
   * - 'input start': 키보드 이벤트가 시작됨을 나타냄.
   * - 'input ongoing': 키보드 이벤트가 진행 중임을 나타냄.
   * - 'input end': 키보드 이벤트가 종료됨을 나타냄.
   */
  keyboardInputState?: string;

  /**
   * 키보드 이벤트의 유형을 나타냄.
   * 이 필드는 키보드 이벤트가 어떤 유형인지 명확히 정의함.
   * 예시:
   * - 'keydown': 키를 눌렀을 때 발생하는 이벤트.
   * - 'keyup': 키를 뗐을 때 발생하는 이벤트.
   * - 'keypress': 키를 누르는 동안 발생하는 이벤트.
   */
  keyboardInputType?: string;

  /**
   * 사용자가 누른 키에 대한 정보.
   * 이 필드는 사용자가 눌린 키가 무엇인지 문자열로 나타냄.
   * 예시:
   * - 'a': 사용자가 'a' 키를 눌렀을 때.
   * - 'Enter': 사용자가 'Enter' 키를 눌렀을 때.
   */
  keyboardInputPressedKey?: string;

  /**
   * 키의 코드에 대한 상세한 정보.
   * 이 필드는 눌린 키의 고유한 코드 값을 나타냄.
   * 일반적으로 키보드 이벤트에서 제공하는 `event.keyCode` 값을 사용함.
   * 예시:
   * - '65': 'A' 키의 키코드.
   * - '13': 'Enter' 키의 키코드.
   */
  keyboardInputKeyCode?: string;

  //스크린샷한 화면 이미지의 Firebase URL.
  imageUrl?: string;
}

export interface LogArray {
  data: LogData[]; // User log data
  result: ResultData; // Result data about log
}

export interface ResultData {
  accessedAt: Timestamp; // Timestamp of when the task was accessed.
  browser: string; // Browser of the user who performed the task.
  os: string; // os of the user who performed the task.
  device: string; // device of the user who performed the task.
  durationSec: number; // Duration in seconds of the task.
  successRate: number; // Success rate of the task.
  userId: string; // User ID of the individual who performed the task.
  userAge: number;
  userGender: string;
  userCountry: string;
  isFinished: boolean; // Task was Finished or Quited
}

export interface TaskData {
  id: string;
  launchedAt: Timestamp; // (write by owner) Timestamp of when the task was launched.
  modifiedAt: Timestamp; // Timestamp of when the task was modified.
  log: LogArray[]; // Click or wheel logs of the user who performed the task.
  title: string; // (write by owner)Title of Task
}

export interface TaskSuiteData {
  id: string;
  title?: string; // Title of Task Suite
}

export interface ProjectData {
  id: string;
  title: string; // Title of project
  ownerID: string; // Project owner user's ID
}
