export interface Challenge {
  challengeId: number;
  title: string;
  challengeVideoPath: string;
  createdAt: string;
  endAt: string;
  userId: number;
  nickname: string;
  profilePath: string;
  participants: number;
}

export interface ChallengeDetails {
  challengeJoinId: number;
  challengeVideoPath: string;
  isLike: boolean;
  likeCnt: number;
  nickname: string;
  score: number;
  userId: number;
}
