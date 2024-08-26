export const UnreadCount = (num: number) => {
  if (num <= 9) return num;
  else return '9+';
};
