import { endKeyboardEvent } from "./keyboardEventTracking";
import { logEvent } from "../utils/sendLogEventToBackground";

/**
 * 휠 방향을 저장하는 변수
 * @type {string}
 */
let wheeDirection = ''

/**
 * 마지막 휠 방향을 저장하는 변수
 * @type {string}
 */
let lastWheelDirection = ''

/**
 * 마지막 휠 이벤트 시간을 저장하는 변수
 * @type {number}
 */
let lastWheelEventTime = 0;

/**
 * 휠 이벤트 타이머 ID를 저장하는 변수
 * @type {number | undefined}
 */
let wheelEventTimeout: number | undefined = undefined;

/**
 * 휠 이벤트 종료를 감지하기 위한 임계값 (0.5초)
 * @type {number}
 */
const wheelEventThreshold = 500; // 0.5s 내에 추가 이벤트가 없으면 휠 동작 종료로 간주

/**
 * 현재 휠 이벤트를 저장하는 변수
 * @type {WheelEvent}
 */
let currentWheelEvent: WheelEvent;

/**
 * 휠 이벤트를 처리하는 함수입니다.
 * @param {WheelEvent} event - 휠 이벤트 객체
 */
export const onWheel = async (event: WheelEvent) => {

    // 휠 이벤트는 다른 이벤트가 모두 종료된 이후에 실행하여야 합니다.
    await endKeyboardEvent(Date.now() - 1);

    currentWheelEvent = event;
    const now = Date.now();
    const deltaY = Math.sign(currentWheelEvent.deltaY);
    wheeDirection = deltaY > 0 ? 'WheelDown' : 'WheelUp';

    if (now - lastWheelEventTime > wheelEventThreshold) {
        console.log("Wheel event: ", "WheelStart", wheeDirection);
        lastWheelDirection = wheeDirection
        wheelLogEvent('wheel', currentWheelEvent, false, Date.now(), "WheelStart", wheeDirection);
    } else {
        if (lastWheelDirection != wheeDirection) {
            endWheelEvent(Date.now() - 1, true)
            return;
        } else {
            console.log("Wheel event: ", "WheelDuring", wheeDirection);
            wheelLogEvent('wheel', currentWheelEvent, false, Date.now(), "WheelDuring", wheeDirection);
        }
    }

    //마우스 휠 이벤트가 끝났는지 감지하기 위한 타이머 재설정
    clearTimeout(wheelEventTimeout); // 기존 타이머 해제
    wheelEventTimeout = window.setTimeout(() => {
        lastWheelEventTime = 0;
        console.log("Wheel event: ", "WheelEnd", wheeDirection);

        if (currentWheelEvent !== null) {
            wheelLogEvent('wheel', currentWheelEvent, true, Date.now(), "WheelEnd", wheeDirection); // 마우스 휠 이벤트 끝 처리
        }
    }, wheelEventThreshold);

    lastWheelEventTime = now;
};

/**
 * 휠 이벤트 종료 처리 함수
 * @param {any} time - 이벤트 종료 시간
 * @param {boolean} [isWheelDirectionChanged] - 휠 방향 변경 여부
 */
export const endWheelEvent = (time: any, isWheelDirectionChanged?: boolean) => {
    if (lastWheelEventTime !== 0 && wheelEventTimeout) {
        lastWheelEventTime = 0; // 키보드 이벤트 타이머 리셋
        clearTimeout(wheelEventTimeout); // 기존 타이머 취소
        wheelEventTimeout = undefined; // 타이머 상태 초기화
        if (currentWheelEvent !== null) {

            if (isWheelDirectionChanged == true) {
                console.log(`WheelEnd due to Wheel Direction Changed`);
                wheelLogEvent('wheel', currentWheelEvent, true, time, "WheelEnd due to Wheel Direction Changed", lastWheelDirection); // 마우스 휠 이벤트 끝 처리
            }
            else {
                console.log(`WheelEnd due to other event`);
                wheelLogEvent('wheel', currentWheelEvent, true, time, "WheelEnd due to other Event", lastWheelDirection); // 마우스 휠 이벤트 끝 처리
            }
        }
        lastWheelDirection = ""; // 마지막 휠 방향 변경
    }
};

/**
 * 휠 이벤트 로그를 기록하는 함수
 * @param {string} eventName - 이벤트 이름
 * @param {WheelEvent} event - 휠 이벤트 객체
 * @param {boolean} isScreenshotRequired - 스크린샷 필요 여부
 * @param {any} [time] - 이벤트 시간
 * @param {string} [wheelState] - 휠 상태
 * @param {string} [wheelDirection] - 휠 방향
 */
export const wheelLogEvent = async (eventName: string, event: WheelEvent, isScreenshotRequired: boolean, time?: any, wheelState?: string, wheelDirection?: string) => {
    logEvent(eventName, event, isScreenshotRequired, time, { wheelDirection: wheelDirection, wheelState: wheelState });
};
