// 비밀번호 강도 검증 함수
export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`{}|:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_\-+=~`{}|:;"'<>,.?/]{8,32}$/;
  return passwordRegex.test(password);
};
