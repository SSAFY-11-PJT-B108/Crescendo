export interface FanArtInfo {
  fanArtId: number;
  userId: number;
  profileImagePath: string;
  nickname: string;
  likeCnt: number;
  fanArtImagePathList: string[];
  content: string;
  commentCnt: number;
  createdAt: string;
  lastModified: string;
  title: string;
  like: boolean;
  isLike: boolean;
}

export interface MyFanArtInfo {
  fanArtId: number;
  userId: number;
  profileImagePath: string;
  nickname: string;
  likeCnt: number;
  fanArtImagePathList: string[];
  content: string;
  commentCnt: number;
  createdAt: string;
  lastModified: string;
  title: string;
  like: boolean;
  isLike: boolean;
  idolGroupId: number;
  idolGroupName: string;
}

export interface GoodsInfo {
  goodsId: number;
  userId: number;
  profileImagePath: string;
  nickname: string;
  likeCnt: number;
  fanArtImagePathList: string[];
  goodsImagePathList: string[];
  content: string;
  commentCnt: number;
  createdAt: string;
  lastModified: string;
  title: string;
  like: boolean;
  isLike: boolean;
}

export interface MyGoodsInfo {
  goodsId: number;
  userId: number;
  profileImagePath: string;
  nickname: string;
  likeCnt: number;
  fanArtImagePathList: string[];
  goodsImagePathList: string[];
  content: string;
  commentCnt: number;
  createdAt: string;
  lastModified: string;
  title: string;
  like: boolean;
  isLike: boolean;
  idolGroupId: number;
  idolGroupName: string;
}

export interface getGalleryListParams {
  'idol-group-id': number;
  page: number;
  size: number;
  title: string;
  nickname: string;
  content: string;
  sortByFollowed: boolean;
  sortByLiked: boolean;
}
