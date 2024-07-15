/**
 * 주어진 HTML 요소에 대한 고유한 XPath를 생성합니다.
 *
 * @param element - 고유한 XPath를 생성할 HTML 요소
 * @returns 주어진 요소에 대한 고유한 XPath 문자열
 */
export function createUniqueXPath(element: HTMLElement) {
    // 요소가 없거나 태그 이름이 없는 경우 null을 반환
    if (!element || !element.tagName) {
        return null;
    }

    let path = '';
    let node = element;

    while (node && node.nodeType === Node.ELEMENT_NODE) {
        // 1: 요소 노드(Element Node) - HTML 요소(예: <div>, <p>, <a>)에 해당합니다.
        let tagName = node.tagName.toLowerCase();
        let index = 0;

        // 이전 형제 노드를 순회하여 같은 태그 이름을 가진 형제 요소의 수를 셈
        let sibling = node.previousSibling;
        while (sibling) {
            if (
                sibling.nodeType === Node.ELEMENT_NODE &&
                (sibling as HTMLElement).tagName.toLowerCase() === tagName
            ) {
                index++;
            }
            sibling = sibling.previousSibling;
        }

        // 형제 요소가 여러 개 있는 경우 위치를 포함한 경로를 생성
        let position = index > 0 ? `[${index + 1}]` : '';
        let currentPath = `/${tagName}${position}`;

        // 현재 경로를 전체 경로에 추가
        path = currentPath + path;

        // 부모 노드로 이동
        node = (node as HTMLElement).parentNode as HTMLElement;
    }

    return path;
}