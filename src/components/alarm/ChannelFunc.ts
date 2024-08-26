export const Channel = (alarmChannelId: number) => {
  if (alarmChannelId === 1) return '[팔로우]';
  else if (alarmChannelId === 2) return '[피드]';
  else if (alarmChannelId === 3) return '[챌린지]';
  else if (alarmChannelId === 4) return '[팬아트]';
  else if (alarmChannelId === 5) return '[굿즈]';
};
