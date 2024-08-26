export function ChatDateTransfer(time: string) {
  if (time === '') return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${year}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일`;
  return formattedDate;
}
