// 닉네임 유효성 검사 함수
export const isValidNickname = (nickname: string): boolean => {
  const nicknameRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎ]{3,10}$/; // 영어, 숫자, 한글, 최소3글자, 최대 10글자
  return nicknameRegex.test(nickname);
};

// 금지된 닉네임 검사 함수 (일치)
export const isExactForbiddenNickname = (nickname: string): boolean => {
  const exactForbiddenNicknames = ['admin', 'root'];
  return exactForbiddenNicknames.includes(nickname.toLowerCase());
};

// 금지된 닉네임 검사 함수 (포함)
export const isIncludedForbiddenNickname = (nickname: string): boolean => {
  const includedForbiddenNicknames = ['새끼', '씨발', '좆'];
  return includedForbiddenNicknames.some(word => nickname.toLowerCase().includes(word));
};
