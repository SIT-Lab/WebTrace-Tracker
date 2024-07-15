import { createUniqueXPath } from "./createUniqueXPath";
import { nowTime } from "./time";

// 이벤트 정보 추출 함수
export const extractEventInfo = (event: Event) => {
    let x: number | undefined;
    let y: number | undefined;
    if (event instanceof MouseEvent) {
        x = event.clientX || undefined;
        y = event.clientY || undefined;
    } else {
        x = undefined;
        y = undefined;
    }
    const target = event.target as HTMLElement;
    const width = target.offsetWidth;
    const height = target.offsetHeight;
    const xpath = createUniqueXPath(target);
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const url = window.location.href;
    // const time = nowTime();
    const nodeName = target.nodeName;

    return { x, y, target, width, height, xpath, hostname, pathname, url, nodeName };
};