export interface user {
  userId: number;
  nickname: string;
  userProfilePath: string;
}

export interface UserInfo {
  profilePath: string;
  nickname: string;
  introduction: string;
  followingNum: number;
  followerNum: number;
  isFollowing: boolean;
  favoriteImagePath: string;
}
