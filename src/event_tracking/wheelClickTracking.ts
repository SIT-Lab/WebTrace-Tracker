import { endKeyboardInput } from "./keyboardInputTracking";
import { endScroll } from "./scrollTracking";
import { logEvent } from "../utils/sendLogEventToBackground";
import { getDOMChanged, resetDOMChanged } from "../observer/observer";

/**
 * 휠 클릭 이벤트를 처리하는 함수입니다.
 * @param {string} eventType - 이벤트 이름.
 * @param {MouseEvent} event - 휠 클릭 이벤트 객체.
 */
export const wheelClick = async (eventType: string, event: MouseEvent) => {
    // 휠 클릭 후 DOM 변화 여부를 확인하고, 변화가 있을 경우에만 작업을 수행
    if (getDOMChanged()) {
        await endKeyboardInput(Date.now() - 1); // 휠 클릭 이벤트 발생 시 키보드 이벤트 종료
        await endScroll(Date.now() - 1);
        console.log('DOM이 변경되었습니다. 화면 스크린샷 작업을 수행합니다.');
        logEvent(eventType, event, true, Date.now());
    } else {
        await endKeyboardInput(Date.now() - 1); // 휠 클릭 이벤트 발생 시 키보드 이벤트 종료
        await endScroll(Date.now() - 1);
        console.log('DOM이 변경되지 않았습니다. 화면 스크린샷 작업을 수행하지 않습니다.');
        logEvent(eventType, event, false, Date.now());
    }

    // 휠 클릭 이벤트 발생 후 DOM 변화 여부를 다시 false로 초기화합니다.
    resetDOMChanged();
};