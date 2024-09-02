import { generateUniqueMessageId } from '../utils/generateUniqueMessageId';

/**
 * 특정 마우스, 키보드 이벤트로 인해 화면을 캡쳐해야할 경우 호출되는 함수.
 * @returns {Promise<string | undefined>} - 캡처된 스크린샷의 base64 데이터 또는 "캡쳐에러발생" 텍스트.
 */
export const captureScreenshot = async (): Promise<string | undefined> => {
    try {
        const screenshotUrl: any = await takeScreenshotAndGetBase64();
        return screenshotUrl;
    } catch (error) {
        console.error("Error obtaining screenshot base64", error);
        return undefined;
    }
};

/**
 * 스크린샷을 캡처하고 base64 데이터를 반환하는 함수.
 * @returns {Promise<string>} - 캡처된 스크린샷의 base64 데이터.
 */
export async function takeScreenshotAndGetBase64() {
    const messageId = generateUniqueMessageId(); // 고유한 메시지 ID 생성

    return new Promise((resolve, reject) => {
        const listener = async (request: any, sender: any, sendResponse: any) => {
            // 해당 messageId에 대한 메시지만 처리
            if (request.messageId === messageId && request.action === 'sendBase64Data') {
                try {
                    if (request.base64Data == "screenshot capture failed") {
                        console.log("캡쳐 도중 에러가 발생하였습니다.")
                        resolve("screenshot capture failed");
                    }
                    else {
                        console.log("캡쳐한 화면에 대한 base64Data 생성하는데 성공했습니다.")
                        resolve(request.base64Data)
                    }
                } catch (error) {
                    reject(error);
                } finally {
                    chrome.runtime.onMessage.removeListener(listener); // 리스너 제거
                }
            }
        };

        // 리스너 등록
        chrome.runtime.onMessage.addListener(listener);

        // 스크린샷 요청 메시지 전송
        chrome.runtime.sendMessage({
            messageId, action: 'takeScreenshot',
        });
    });
}

/**
 * 백그라운드 스크립트에서 화면을 캡쳐하고 base64 형태의 데이터를 생성하는 함수.
 */
export async function takeScreenshot(message: any, sender: any) {
    try {
        // 현재 활성 탭의 스크린샷을 캡처
        const screenshot: string = await new Promise((resolve, reject) => {
            chrome.tabs.captureVisibleTab(null as any, { format: 'jpeg', quality: 50 }, (screenShot) => {
                if (chrome.runtime.lastError) {
                    const errorMessage = chrome.runtime.lastError.message;
                    console.error(errorMessage);
                    reject("screenshot capture failed");
                } else {
                    resolve(screenShot);
                }
            });
        });

        // base64 인코딩된 URL에서 순수 데이터 부분만 추출
        const base64Data = screenshot.split(',')[1];
        console.log(typeof (base64Data));

        // background에서 contentScript로 메시지를 보냄
        if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, { messageId: message.messageId, action: 'sendBase64Data', base64Data: base64Data });
        }
    } catch (error) {
        let base64Data: string; // 변수를 선언합니다.

        base64Data = "screenshot capture failed";
        console.log("캡쳐 도중 에러가 발생하였습니다.");

        if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, { messageId: message.messageId, action: 'sendBase64Data', base64Data: base64Data });
        }
    }
}