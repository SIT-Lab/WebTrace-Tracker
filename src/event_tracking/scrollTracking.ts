import { endKeyboardInput } from "./keyboardInputTracking";
import { logEvent } from "../utils/sendLogEventToBackground";

/**
 * 스크롤 방향을 저장하는 변수
 * @type {string}
 */
let scrollDirection = ''

/**
 * 마지막 스크롤 방향을 저장하는 변수
 * @type {string}
 */
let lastScrollDirection = ''

/**
 * 마지막 스크롤 입력 시간을 저장하는 변수
 * @type {number}
 */
let lastScrollTime = 0;

/**
 * 스크롤 입력 타이머 ID를 저장하는 변수
 * @type {number | undefined}
 */
let scrollTimeout: number | undefined = undefined;

/**
 * 스크롤 입력 종료를 감지하기 위한 임계값 (0.5초)
 * @type {number}
 */
const scrollThreshold = 500; // 0.5s 내에 추가 이벤트가 없으면 휠 동작 종료로 간주

/**
 * 현재 스크롤 입력을 저장하는 변수
 * @type {WheelEvent}
 */
let currentScroll: WheelEvent;

/**
 * 스크롤 이벤트를 처리하는 함수입니다.
 * @param {WheelEvent} event - 휠 이벤트 객체
 */
export const onWheel = async (event: WheelEvent) => {

    // 스크롤은 다른 이벤트가 모두 종료된 이후에 실행하여야 합니다.
    await endKeyboardInput(Date.now() - 1);

    currentScroll = event;
    const now = Date.now();
    const deltaY = Math.sign(currentScroll.deltaY);
    scrollDirection = deltaY > 0 ? 'scroll down' : 'scroll up';

    if (now - lastScrollTime > scrollThreshold) {
        console.log("scroll: ", "scroll start", scrollDirection);
        lastScrollDirection = scrollDirection
        scrollLogEvent('scroll', currentScroll, false, Date.now(), "scroll start", scrollDirection);
    } else {
        if (lastScrollDirection != scrollDirection) {
            endScroll(Date.now() - 1, true)
            return;
        } else {
            console.log("scroll: ", "scrolling", scrollDirection);
            scrollLogEvent('scroll', currentScroll, false, Date.now(), "scrolling", scrollDirection);
        }
    }

    //스크롤이 끝났는지 감지하기 위한 타이머 재설정
    clearTimeout(scrollTimeout); // 기존 타이머 해제
    scrollTimeout = window.setTimeout(() => {
        lastScrollTime = 0;
        console.log("scroll: ", "scroll end", scrollDirection);

        if (currentScroll !== null) {
            scrollLogEvent('scroll', currentScroll, true, Date.now(), "scroll end", scrollDirection); // 스크롤 종료 처리
        }
    }, scrollThreshold);

    lastScrollTime = now;
};

/**
 * 스크롤 종료 처리 함수
 * @param {any} time - 스크롤 종료 시간
 * @param {boolean} [isScrollDirectionChanged] - 스크롤 방향 변경 여부
 */
export const endScroll = (time: any, isScrollDirectionChanged?: boolean) => {
    if (lastScrollTime !== 0 && scrollTimeout) {
        lastScrollTime = 0; // 스크롤 타이머 리셋
        clearTimeout(scrollTimeout); // 기존 타이머 취소
        scrollTimeout = undefined; // 타이머 상태 초기화
        if (currentScroll !== null) {

            if (isScrollDirectionChanged == true) {
                console.log(`scroll end due to scroll direction changed`);
                // scrollLogEvent('scroll', currentScroll, true, time, "scroll end due to scroll direction changed", lastScrollDirection); // 스크롤 종료 처리
                scrollLogEvent('scroll', currentScroll, true, time, "scroll end", lastScrollDirection);
            }
            else {
                console.log(`scroll end due to other event`);
                // scrollLogEvent('scroll', currentScroll, true, time, "scroll end due to other event", lastScrollDirection); // 스크롤 종료 처리
                scrollLogEvent('scroll', currentScroll, true, time, "scroll end", lastScrollDirection); // 스크롤 종료 처리
            }
        }
        lastScrollDirection = ""; // 마지막 휠 방향 변경
    }
};

/**
 * 스크롤 로그를 기록하는 함수
 * @param {string} eventType - 이벤트 타입
 * @param {WheelEvent} event - 휠 이벤트 객체
 * @param {boolean} isScreenshotRequired - 스크린샷 필요 여부
 * @param {any} [time] - 스크롤 시간
 * @param {string} [scrollState] - 스크롤 상태
 * @param {string} [scrollDirection] - 스크롤 방향
 */
export const scrollLogEvent = async (eventType: string, event: WheelEvent, isScreenshotRequired: boolean, time?: any, scrollState?: string, scrollDirection?: string) => {
    logEvent(eventType, event, isScreenshotRequired, time, { scrollDirection: scrollDirection, scrollState: scrollState });
};
