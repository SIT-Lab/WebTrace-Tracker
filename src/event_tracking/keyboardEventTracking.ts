import { logEvent } from "../utils/sendLogEventToBackground";
import { endWheelEvent } from "./wheelEventTracking";

let lastKeyBoardEventTime = 0; // 마지막 키보드 이벤트 시간
let KeyBoardEventTimeout: number | undefined = undefined; // 키보드 이벤트 타이머
const KeyBoardEventThreshold = 1000; // 1.0s 내에 추가 이벤트가 없으면 키보드 동작 종료로 간주
let currentKeyboardEvent: KeyboardEvent; // 현재 키보드 이벤트 저장 변수

/**
 * 키보드 이벤트를 처리하는 함수
 * @param {KeyboardEvent} event - 키보드 이벤트 객체
 */
export const onKeyboard = async (event: KeyboardEvent) => {
    //키보드 이벤트는 다른 이벤트가 모두 종료된 이후에 실행되어야 함
    await endWheelEvent(Date.now() - 1);

    currentKeyboardEvent = event;
    const now = Date.now();

    // 첫 번째 이벤트인 경우 또는 마지막 이벤트가 임계값(1.0s)을 초과한 경우 'KeyboardStart'로 설정
    if (now - lastKeyBoardEventTime > KeyBoardEventThreshold) {
        console.log(`Keyboard event: KeyboardStart`);

        switch (currentKeyboardEvent.code) {
            case "Numpad0":
            case "Numpad1":
            case "Numpad2":
            case "Numpad3":
            case "Numpad4":
            case "Numpad5":
            case "Numpad6":
            case "Numpad7":
            case "Numpad8":
            case "Numpad9":
                if (isNaN(parseInt(currentKeyboardEvent.key)) == true) { // Numpad keys를 눌렀지만 숫자가 아닌 다른 부호를 클릭한 경우 키보드 이벤트가 종료되었다고 간주
                    lastKeyBoardEventTime = now
                    console.log(`Keyboard event: Not a number key, received ${currentKeyboardEvent.key}`);
                    keyboardLogEvent("KeyboardEvent", event, false, Date.now(), "KeyboardStart", currentKeyboardEvent.type, currentKeyboardEvent.key, currentKeyboardEvent.code);
                    endKeyboardEvent(Date.now() + 1, `${currentKeyboardEvent.key}`)
                    return;
                } else {
                    console.log("currentKeyboardEvent.key -> ", currentKeyboardEvent.key)
                    keyboardLogEvent("KeyboardEvent", event, false, Date.now(), "KeyboardStart", currentKeyboardEvent.type, currentKeyboardEvent.key, currentKeyboardEvent.code);
                }
                break;
            case "Space":
            case " ":
            case "ShiftLeft":
            case "ShiftRight":
            case "CapsLock":
            case "NumLock":
            case "NumpadAdd":
            case "NumpadSubtract":
            case "NumpadMultiply":
            case "NumpadDivide":
            case "NumpadDecimal":
            case "NumpadEnter":
            case "NumpadEqual":
                // Printable 키 또는 Non-printable 키 중 일부(Space, Shift, CapsLock 등)를 입력한 경우
                console.log("currentKeyboardEvent.key -> ", currentKeyboardEvent.key)
                keyboardLogEvent("KeyboardEvent", event, false, Date.now(), "KeyboardStart", currentKeyboardEvent.type, currentKeyboardEvent.key, currentKeyboardEvent.code);
                break;
            default:
                // Printable 키를 입력한 경우
                if ((currentKeyboardEvent.key.length == 1) && (currentKeyboardEvent.key.match(/[a-z]/) || currentKeyboardEvent.key.match(/[A-Z]/) || currentKeyboardEvent.key.match(/[~`!@#$%^&*()-_+={[}\]|\\:;"'<,>.?/]/))) {
                    console.log(`Keyboard event: ${currentKeyboardEvent.key}`);
                    keyboardLogEvent("KeyboardEvent", event, false, Date.now(), "KeyboardStart", currentKeyboardEvent.type, currentKeyboardEvent.key, currentKeyboardEvent.code);
                } else {
                    //Start State에 입력한 키가 Non-printable Keys라면 시작과 동시에 종료
                    lastKeyBoardEventTime = now
                    console.log(`Keyboard event: KeyboardEnd due to ${currentKeyboardEvent.key}`);
                    keyboardLogEvent("KeyboardEvent", event, false, Date.now(), "KeyboardStart", currentKeyboardEvent.type, currentKeyboardEvent.key, currentKeyboardEvent.code);
                    endKeyboardEvent(Date.now() + 1, `${currentKeyboardEvent.key}`)
                    return;
                }
                break;
        }
    }
    else {
        //이전 이벤트로부터 임계값(1.0s) 내에 키보드 이벤트가 발생한 경우 'KeyboardDuring' 상태로 설정
        switch (currentKeyboardEvent.code) {
            case "Numpad0":
            case "Numpad1":
            case "Numpad2":
            case "Numpad3":
            case "Numpad4":
            case "Numpad5":
            case "Numpad6":
            case "Numpad7":
            case "Numpad8":
            case "Numpad9":
                if (isNaN(parseInt(currentKeyboardEvent.key)) == true) { // Numpad keys를 눌렀지만 숫자가 아닌 다른 부호를 클릭한 경우 키보드 이벤트가 종료되었다고 간주
                    lastKeyBoardEventTime = now
                    console.log(`Keyboard event: Not a number key, received ${currentKeyboardEvent.key}`);
                    endKeyboardEvent(Date.now() + 1, `${currentKeyboardEvent.key}`)
                    return;
                } else {
                    console.log("currentKeyboardEvent.key -> ", currentKeyboardEvent.key)
                    keyboardLogEvent("KeyboardEvent", event, false, Date.now(), "KeyboardDuring", currentKeyboardEvent.type, currentKeyboardEvent.key, currentKeyboardEvent.code);
                }
                break;
            case "Space":
            case " ":
            case "ShiftLeft":
            case "ShiftRight":
            case "CapsLock":
            case "NumLock":
            case "NumpadAdd":
            case "NumpadSubtract":
            case "NumpadMultiply":
            case "NumpadDivide":
            case "NumpadDecimal":
            case "NumpadEnter":
            case "NumpadEqual":
                // Printable 키 또는 Non-printable 키 중 일부(Space, Shift, CapsLock 등)를 입력한 경우
                console.log(`Keyboard event: KeyboardDuring`);
                console.log("currentKeyboardEvent.key -> ", currentKeyboardEvent.key)
                keyboardLogEvent("KeyboardEvent", event, false, Date.now(), "KeyboardDuring", currentKeyboardEvent.type, currentKeyboardEvent.key, currentKeyboardEvent.code);
                break;
            default:
                // Printable 키를 입력한 경우
                if ((currentKeyboardEvent.key.length == 1) && (currentKeyboardEvent.key.match(/[a-z]/) || currentKeyboardEvent.key.match(/[A-Z]/) || currentKeyboardEvent.key.match(/[~`!@#$%^&*()-_+={[}\]|\\:;"'<,>.?/]/))) {
                    console.log(`Keyboard event: KeyboardDuring`);
                    console.log(`Keyboard event: ${currentKeyboardEvent.key}`);
                    keyboardLogEvent("KeyboardEvent", event, false, Date.now(), "KeyboardDuring", currentKeyboardEvent.type, currentKeyboardEvent.key, currentKeyboardEvent.code);
                } else {
                    //Start State에 입력한 키가 Non-printable Keys라면 시작과 동시에 종료
                    lastKeyBoardEventTime = now
                    console.log(`Keyboard event: KeyboardEnd due to ${currentKeyboardEvent.key}`);
                    endKeyboardEvent(Date.now() + 1, `${currentKeyboardEvent.key}`)
                    return;
                }
                break;
        }
    }

    // 이벤트 종료 타이머 설정
    clearTimeout(KeyBoardEventTimeout);
    KeyBoardEventTimeout = window.setTimeout(() => {
        lastKeyBoardEventTime = 0;
        console.log(`Keyboard event: KeyboardEnd`);
        KeyBoardEventTimeout = undefined;
        if (currentKeyboardEvent !== null) {
            keyboardLogEvent("KeyboardEvent", currentKeyboardEvent, true, Date.now(),
                "KeyboardEnd", //KeyboardEventState
                undefined, // KeyboardEventType
                undefined, // KeyboardEventPressedKey
                undefined // KeyboardEventKeyCode 
            );
        }

    }, KeyBoardEventThreshold);

    // 마지막 키 이벤트 시간 갱신
    lastKeyBoardEventTime = now;
};

/**
 * 키보드 이벤트 종료 처리 함수
 * @param {number} time - 키보드 이벤트 종료 시간
 * @param {string} [isEscapeKey] - 종료를 트리거한 키 (옵션)
 */
export const endKeyboardEvent = (time: any, isEscapeKey?: string) => {
    if (lastKeyBoardEventTime !== 0 || KeyBoardEventTimeout) {
        clearTimeout(KeyBoardEventTimeout); // 기존 타이머 취소
        KeyBoardEventTimeout = undefined; // 타이머 상태 초기화
        lastKeyBoardEventTime = 0; // 키보드 이벤트 타이머 리셋

        if (currentKeyboardEvent !== null) {
            if (isEscapeKey) {
                //키보드 이벤트를 종료시키는 Non-printable keys가 입력된 경우
                console.log(`KeyboardEnd due to Pressing ${isEscapeKey}`);
                keyboardLogEvent("KeyboardEvent", currentKeyboardEvent, true, time,
                    `KeyboardEnd due to Pressing ${isEscapeKey} Key`, //KeyboardEventState
                    undefined, // KeyboardEventType
                    undefined, // KeyboardEventPressedKey
                    undefined // KeyboardEventKeyCode
                )
            }
            else {
                //다른 이벤트 (예: 마우스 클릭 이벤트, 스크롤 이벤트)가 간섭한 경우
                console.log(`Keyboard event: KeyboardEnd due to other event`);
                keyboardLogEvent("KeyboardEvent", currentKeyboardEvent, true, time,
                    "KeyboardEnd due to other event", //KeyboardEventState
                    undefined, // KeyboardEventType
                    undefined, // KeyboardEventPressedKey
                    undefined // KeyboardEventKeyCode 
                );
            }
        }
    }
}

/**
 * 키보드 이벤트를 로깅하는 함수
 * @param {string} eventName - 이벤트 이름
 * @param {KeyboardEvent} event - 키보드 이벤트 객체
 * @param {boolean} isScreenshotRequired - 스크린샷 필요 여부
 * @param {number} time - 이벤트 발생 시간
 * @param {string} [KeyboardEventState] - 키보드 이벤트 상태 (옵션)
 * @param {string} [KeyboardEventType] - 키보드 이벤트 타입 (옵션)
 * @param {string} [KeyboardEventPressedKey] - 키보드 이벤트 키 (옵션)
 * @param {string} [KeyboardEventKeyCode] - 키보드 이벤트 키 코드 (옵션)
 */
export const keyboardLogEvent = async (eventName: string, event: KeyboardEvent, isScreenshotRequired: boolean, time: any, KeyboardEventState?: string, KeyboardEventType?: string, KeyboardEventPressedKey?: string, KeyboardEventKeyCode?: string) => {
    logEvent(eventName, event, isScreenshotRequired, time, { KeyboardEventState: KeyboardEventState, KeyboardEventType: KeyboardEventType, KeyboardEventPressedKey: KeyboardEventPressedKey, KeyboardEventKeyCode: KeyboardEventKeyCode });
};