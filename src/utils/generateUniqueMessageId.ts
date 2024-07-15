export function generateUniqueMessageId() {
  // 고유한 메시지 ID 생성 로직
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
