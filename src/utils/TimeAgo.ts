export function timeAgo(timestamp: string | null): string {
  if (timestamp === null) {
    return '시작전';
  }
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diff = now.getTime() - messageTime.getTime();
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return '방금';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} 분전`;
  } else if (diffHours < 24) {
    return `${diffHours} 시간전`;
  } else {
    return `${diffDays} 일전`;
  }
}
