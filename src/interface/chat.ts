export interface Chat {
  dmGroupId: number;
  content: string;
  writerId: number;
}

export interface ChatRoom {
  dmGroupId: number;
  opponentId: number;
  opponentProfilePath: string;
  opponentNickName: string;
  lastChatting: string;
  lastChattingTime: string;
}
export interface Message {
  dmMessageId: number;
  message: string;
  createdAt: string;
  writerId: number;
  writerNickName: string;
  writerProfilePath: string;
  dmGroupId: number;
}
//DM그룹아이디
