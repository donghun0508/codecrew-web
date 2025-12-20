/**
 * 닉네임 유효성 검사
 * @param {string} nickname - 검증할 닉네임
 * @returns {string|null} 에러 메시지 또는 null (유효한 경우)
 */
export function validateNickname(nickname) {
  if (!nickname || !nickname.trim()) {
    return "닉네임을 입력해주세요.";
  }

  if (!/^.{2,12}$/.test(nickname.trim())) {
    return "닉네임은 2~12자여야 합니다.";
  }

  return null;
}
