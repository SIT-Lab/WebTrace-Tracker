import { LogData } from "interfaces/apiTypes";
import { generateHash } from '../utils/generateHash';
import { extractEventInfo } from '../utils/extractEventInfo';
import { captureScreenshot } from "../screenshot/screenshotUtils";

/**
 * 로그 데이터를 생성하고 전송하는 함수
 * @param {string} eventType - 이벤트 이름
 * @param {Event} event - 이벤트 객체
 * @param {boolean} isScreenshotRequired - 스크린샷 필요 여부
 * @param {any} time - 이벤트 발생 시간
 * @param {object} additionalData - 추가 데이터 (옵션)
 */
export const logEvent = async (eventType: string, event: Event, isScreenshotRequired: boolean, time: any, additionalData = {}) => {
    // 이벤트 정보 추출
    const { x, y, width, height, xpath, hostName, pathName, url, nodeName } = extractEventInfo(event);

    // 이벤트 정보로 해시 생성
    const hash = await generateHash(url + pathName + xpath + eventType);

    let screenshotBase64;

    // 스크린샷이 필요한 경우 스크린샷 캡처
    if (isScreenshotRequired == true) {
        screenshotBase64 = await captureScreenshot();
    } else {
        screenshotBase64 = undefined;
    }

    let logData: any

    // 로그 데이터 생성
    if (isScreenshotRequired) {
        logData = {
            eventType: eventType,
            hostName,
            pathName,
            time: time,
            x,
            y,
            w: width,
            h: height,
            xpath,
            url,
            hash,
            imageUrl: screenshotBase64,
            nodeName,
            ...additionalData, // 통합할 추가 데이터
        } as LogData;
        console.log("logEvent에서 screenshotBase64: ", screenshotBase64)
        // 백그라운드 스크립트로 로그 데이터 전송
        chrome.runtime.sendMessage({ action: "logData", data: logData });
    }
    else {
        logData = {
            eventType: eventType,
            hostName,
            pathName,
            time: time,
            x,
            y,
            w: width,
            h: height,
            xpath,
            url,
            hash,
            imageUrl: "",
            nodeName,
            ...additionalData, // 통합할 추가 데이터
        } as LogData;
        // 백그라운드 스크립트로 로그 데이터 전송
        chrome.runtime.sendMessage({ action: "logData", data: logData });
    }
};