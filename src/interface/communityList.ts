export interface CommunityInfo {
  idolGroupId: number;
  name: string;
  profile: string;
}

export interface CommunityListResponse {
  content: CommunityInfo[];
  pageable: {
    pageNumber: number; //현재 페이지 번호
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number; // 현재 페이지 번호
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface CommunityDetailInfo {
  idolGroupId: number;
  name: string;
  peopleNum: number;
  introduction: string;
  profile: string;
  banner: string;
  favoriteCnt: number;
  isFavorite: boolean;
}
