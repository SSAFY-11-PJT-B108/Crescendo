export interface FavoriteRankInfo {
  idolGroupName: string;
  idolName: string;
  writerId: number;
  writerNickname: string;
  writerProfilePath: string | null;
  favoriteRankId: number;
  favoriteIdolImagePath: string;
  likeCnt: number;
  isLike: boolean;
  createdAt: string;
}

export interface FavoriteRankListResponse {
  content: FavoriteRankInfo[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  empty: boolean;
}

export interface IdolGroupInfo {
  groupId: number;
  groupName: string;
}

export interface IdolInfo {
  idolId: number;
  idolName: string;
}

export interface BestPhotoInfo {
  idolId: number;
  idolGroupName: string;
  idolName: string;
  favoriteIdolImagePath: string;
}
