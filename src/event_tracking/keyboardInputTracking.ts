import { logEvent } from "../utils/sendLogEventToBackground";
import { endScroll } from "./scrollTracking";

let lastKeyboardInputTime = 0; // 마지막 키보드 입력 시간
let keyboardInputTimeout: number | undefined = undefined; // 키보드 입력 타이머
const KeyboardInputThreshold = 1000; // 1.0s 내에 추가 입력이 없으면 키보드 동작 종료로 간주
let currentKeyboardInput: KeyboardEvent; // 현재 키보드 이벤트 저장 변수

/**
 * 키보드 입력 처리하는 함수
 * @param {KeyboardEvent} event - 키보드 이벤트 객체
 */
export const onKeyboard = async (event: KeyboardEvent) => {
    //키보드 입력은 다른 입력이 모두 종료된 이후에 실행되어야 함
    await endScroll(Date.now() - 1);

    currentKeyboardInput = event;
    const now = Date.now();

    // 첫 번째 입력인 경우 또는 마지막 입력이 임계값(1.0s)을 초과한 경우 'input start'로 설정
    if (now - lastKeyboardInputTime > KeyboardInputThreshold) {
        console.log(`keyboard input: input start`);

        switch (currentKeyboardInput.code) {
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
                if (isNaN(parseInt(currentKeyboardInput.key)) == true) { // Numpad keys를 눌렀지만 숫자가 아닌 다른 부호를 클릭한 경우 키보드 입력이 종료되었다고 간주
                    lastKeyboardInputTime = now
                    console.log(`Keyboard input: Not a number key, received ${currentKeyboardInput.key}`);
                    keyboardLogEvent("keyboard input", event, false, Date.now(), "input start", currentKeyboardInput.type, currentKeyboardInput.key, currentKeyboardInput.code);
                    endKeyboardInput(Date.now() + 1, `${currentKeyboardInput.key}`)
                    return;
                } else {
                    console.log("currentKeyboardEvent.key -> ", currentKeyboardInput.key)
                    keyboardLogEvent("keyboard input", event, false, Date.now(), "input start", currentKeyboardInput.type, currentKeyboardInput.key, currentKeyboardInput.code);
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
                console.log("currentKeyboardEvent.key -> ", currentKeyboardInput.key)
                keyboardLogEvent("keyboard input", event, false, Date.now(), "input start", currentKeyboardInput.type, currentKeyboardInput.key, currentKeyboardInput.code);
                break;
            default:
                // Printable 키를 입력한 경우
                if ((currentKeyboardInput.key.length == 1) && (currentKeyboardInput.key.match(/[a-z]/) || currentKeyboardInput.key.match(/[A-Z]/) || currentKeyboardInput.key.match(/[~`!@#$%^&*()-_+={[}\]|\\:;"'<,>.?/]/))) {
                    console.log(`keyboard input: ${currentKeyboardInput.key}`);
                    keyboardLogEvent("keyboard input", event, false, Date.now(), "input start", currentKeyboardInput.type, currentKeyboardInput.key, currentKeyboardInput.code);
                } else {
                    //Start State에 입력한 키가 Non-printable Keys라면 시작과 동시에 종료
                    lastKeyboardInputTime = now
                    console.log(`keyboard input: input end due to ${currentKeyboardInput.key}`);
                    keyboardLogEvent("keyboard input", event, false, Date.now(), "input start", currentKeyboardInput.type, currentKeyboardInput.key, currentKeyboardInput.code);
                    endKeyboardInput(Date.now() + 1, `${currentKeyboardInput.key}`)
                    return;
                }
                break;
        }
    }
    else {
        //이전 입력으로부터 임계값(1.0s) 내에 키보드 입력이 발생한 경우 'input ongoing' 상태로 설정
        switch (currentKeyboardInput.code) {
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
                if (isNaN(parseInt(currentKeyboardInput.key)) == true) { // Numpad keys를 눌렀지만 숫자가 아닌 다른 부호를 클릭한 경우 키보드 입력이 종료되었다고 간주
                    lastKeyboardInputTime = now
                    console.log(`keyboard input: Not a number key, received ${currentKeyboardInput.key}`);
                    endKeyboardInput(Date.now() + 1, `${currentKeyboardInput.key}`)
                    return;
                } else {
                    console.log("currentKeyboardEvent.key -> ", currentKeyboardInput.key)
                    keyboardLogEvent("keyboard input", event, false, Date.now(), "input ongoing", currentKeyboardInput.type, currentKeyboardInput.key, currentKeyboardInput.code);
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
                console.log(`keyboard input: input ongoing`);
                console.log("currentKeyboardEvent.key -> ", currentKeyboardInput.key)
                keyboardLogEvent("keyboard input", event, false, Date.now(), "input ongoing", currentKeyboardInput.type, currentKeyboardInput.key, currentKeyboardInput.code);
                break;
            default:
                // Printable 키를 입력한 경우
                if ((currentKeyboardInput.key.length == 1) && (currentKeyboardInput.key.match(/[a-z]/) || currentKeyboardInput.key.match(/[A-Z]/) || currentKeyboardInput.key.match(/[~`!@#$%^&*()-_+={[}\]|\\:;"'<,>.?/]/))) {
                    console.log(`keyboard input: input ongoing`);
                    console.log(`keyboard input: ${currentKeyboardInput.key}`);
                    keyboardLogEvent("keyboard input", event, false, Date.now(), "input ongoing", currentKeyboardInput.type, currentKeyboardInput.key, currentKeyboardInput.code);
                } else {
                    //Start State에 입력한 키가 Non-printable Keys라면 시작과 동시에 종료
                    lastKeyboardInputTime = now
                    console.log(`keyboard input: input end due to ${currentKeyboardInput.key}`);
                    endKeyboardInput(Date.now() + 1, `${currentKeyboardInput.key}`)
                    return;
                }
                break;
        }
    }

    // 입력 종료 타이머 설정
    clearTimeout(keyboardInputTimeout);
    keyboardInputTimeout = window.setTimeout(() => {
        lastKeyboardInputTime = 0;
        console.log(`keyboard input: input end`);
        keyboardInputTimeout = undefined;
        if (currentKeyboardInput !== null) {
            keyboardLogEvent("keyboard input", currentKeyboardInput, true, Date.now(),
                "input end", //keyboardInputState
                undefined, // keyboardInputType
                undefined, // keyboardInputPressedKey
                undefined // keyboardInputKeyCode 
            );
        }

    }, KeyboardInputThreshold);

    // 마지막 키보드 입력 시간 갱신
    lastKeyboardInputTime = now;
};

/**
 * 키보드 입력 종료 처리 함수
 * @param {number} time - 키보드 입력 종료 시간
 * @param {string} [isEscapeKey] - 종료를 트리거한 키 (옵션)
 */
export const endKeyboardInput = (time: any, isEscapeKey?: string) => {
    if (lastKeyboardInputTime !== 0 || keyboardInputTimeout) {
        clearTimeout(keyboardInputTimeout); // 기존 타이머 취소
        keyboardInputTimeout = undefined; // 타이머 상태 초기화
        lastKeyboardInputTime = 0; // 키보드 입력 타이머 리셋

        if (currentKeyboardInput !== null) {
            if (isEscapeKey) {
                //키보드 입력을 종료시키는 Non-printable keys가 입력된 경우
                console.log(`input end due to pressing ${isEscapeKey}`);
                keyboardLogEvent("keyboard input", currentKeyboardInput, true, time,
                    `input end due to pressing ${isEscapeKey} key`, //keyboardInputState
                    undefined, // keyboardInputType
                    undefined, // keyboardInputPressedKey
                    undefined // keyboardInputKeyCode
                )
            }
            else {
                //다른 이벤트 (예: 마우스 클릭, 스크롤)가 간섭한 경우
                console.log(`keyboard input: input end due to other event`);
                keyboardLogEvent("keyboard input", currentKeyboardInput, true, time,
                    "input end due to other event", //keyboardInputState
                    undefined, // keyboardInputType
                    undefined, // keyboardInputPressedKey
                    undefined // keyboardInputKeyCode 
                );
            }
        }
    }
}

/**
 * 키보드 이벤트를 로깅하는 함수
 * @param {string} eventType - 이벤트 타입
 * @param {KeyboardEvent} event - 키보드 이벤트 객체
 * @param {boolean} isScreenshotRequired - 스크린샷 필요 여부
 * @param {number} time - 이벤트 발생 시간
 * @param {string} [keyboardInputState] - 키보드 이벤트 상태 (옵션)
 * @param {string} [keyboardInputType] - 키보드 이벤트 타입 (옵션)
 * @param {string} [keyboardInputPressedKey] - 키보드 이벤트 키 (옵션)
 * @param {string} [keyboardInputKeyCode] - 키보드 이벤트 키 코드 (옵션)
 */
export const keyboardLogEvent = async (eventType: string, event: KeyboardEvent, isScreenshotRequired: boolean, time: any, keyboardInputState?: string, keyboardInputType?: string, keyboardInputPressedKey?: string, keyboardInputKeyCode?: string) => {
    logEvent(eventType, event, isScreenshotRequired, time, { keyboardInputState: keyboardInputState, keyboardInputType: keyboardInputType, keyboardInputPressedKey: keyboardInputPressedKey, keyboardInputKeyCode: keyboardInputKeyCode });
};