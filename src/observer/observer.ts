/**
 * 대상 노드를 선택합니다.
 * @type {HTMLElement}
 */
const targetNode = document.body;

/**
 * DOM 변화 여부를 나타내는 변수를 선언합니다.
 * @type {boolean}
 */
let hasDOMChanged = false;

/**
 * DOM 변화 여부를 초기화하는 함수입니다.
 */
function resetDOMChanged(): void {
    hasDOMChanged = false;
}

/**
 * DOM 변화 여부를 반환하는 함수입니다.
 */
function getDOMChanged(): boolean {
    return hasDOMChanged;
}

// childList: 타겟 노드의 자식 엘리먼트(텍스트 노드를 포함)의 추가 또는 제거를 관찰할 때 true
// attributes: 타겟 노드의 속성 변화를 관찰할 때 true
// characterData: 타겟 노드의 텍스트 내용 변화를 관찰할 때 true
// subtree: 타겟 노드뿐만 아니라 모든 자손 노드의 변화를 관찰할 때 true
// attributeOldValue: attributes이 true일 때, 변경된 속성의 이전 값을 기록할 때 true
// characterDataOldValue: characterData가 true일 때, 변경된 텍스트의 이전 값을 기록할 때 true
// attributeFilter: 특정 속성만 관찰하고 싶을 때, 관찰할 속성명을 배열로 지정

/**
 * 변화를 감시할 Mutation Observer를 생성합니다.
 * @param {Array} mutationsList - 감지된 변화 목록.
 * @param {MutationObserver} observer - 이 MutationObserver 인스턴스.
 */
const observer = new MutationObserver((mutationsList, observer) => {
    // 변화가 감지되었을 때 실행할 로직.
    console.log('body 요소가 변경되었습니다.');
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            hasDOMChanged = true;
        } else if (mutation.type === 'attributes') {
            hasDOMChanged = true;
        } else if (mutation.type === 'characterData') {
            hasDOMChanged = true;
        }
    });
});

/**
 * Mutation Observer를 설정하고 감시를 시작합니다.
 * 이 설정에 따라서 돔변화의 영역을 설정합니다.
 * @type {Object}
 * @property {boolean} childList - 자식 엘레멘트들의 추가 혹은 제거 관찰 여부.
 * @property {boolean} attributes - 속성들의 변형 관찰 여부.
 * @property {boolean} subtree - 자손 노드들의 변형 관찰 여부.
 */
const config = { childList: true, subtree: true, attributes: true };

// 초기 Observer 연결
observer.observe(targetNode, config);

/**
 * URL 변경을 처리하는 함수입니다.
 */
function handleUrlChange() {
    console.log('URL이 변경되었습니다.');
    // DOM 변화를 감지하도록 Observer를 다시 연결합니다.
    observer.disconnect();
    observer.observe(targetNode, config);
    hasDOMChanged = true;  // URL이 변경되면 DOM이 변경된 것으로 간주
}

// 기존 history 메서드 백업
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

/**
 * history.pushState를 감싸는 함수입니다.
 * @param {...any} args - pushState에 전달되는 인자들.
 */
history.pushState = function (...args) {
    originalPushState.apply(this, args);
    handleUrlChange();
};

/**
 * history.replaceState를 감싸는 함수입니다.
 * @param {...any} args - replaceState에 전달되는 인자들.
 */
history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    handleUrlChange();
};

// popstate 이벤트 리스너
window.addEventListener('popstate', handleUrlChange);

export { observer, config, handleUrlChange, resetDOMChanged, getDOMChanged };