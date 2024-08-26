export interface Alarm {
  alarmId: number;
  alarmChannelId: number; //채팅 팔로우 피드 ,갤러리
  relatedId: number; //아 그 피드 아이디 이동하도록..!
  content: string;
  isRead: boolean;
  createdAt: string;
}
