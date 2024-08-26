import { Authapi, api } from './core';

export const UserSearchApi = async (page: number, size: number, nickname: string) => {
  const response = await api.get(
    `/api/v1/user/search?page=${page}&size=${size}&nickname=${nickname}`,
  );
  return response.data;
};
export const getMyFeedAPI = async (userId: number, page: number, size: number) => {
  const response = await api.get(`/api/v1/community/feed/user/${userId}?page=${page}&size=${size}`);
  return response.data;
};
export const getMyFanArtAPI = async (userId: number, page: number, size: number) => {
  const response = await api.get(
    `/api/v1/community/fan-art/user/${userId}?page=${page}&size=${size}`,
  );
  return response.data;
};
export const getMyGoodsAPI = async (userId: number, page: number, size: number) => {
  const response = await api.get(
    `/api/v1/community/goods/user/${userId}?page=${page}&size=${size}`,
  );
  return response.data;
};

export const getUserInfoAPI = async (userId: number, loggedInUserId: number) => {
  const response = await Authapi.get(`/api/v1/user/${userId}?loggedInUserId=${loggedInUserId}`);
  return response.data;
};

export const modifyNicknameAPI = async (userId: number, nickname: string) => {
  const response = await Authapi.patch(`/api/v1/user/mypage/nickname?loggedInUserId=${userId}`, {
    nickname,
  });
  return response;
};

export const modifyIntroductionAPI = async (userId: number, introduction: string) => {
  const response = await Authapi.patch(
    `/api/v1/user/mypage/introduction?loggedInUserId=${userId}`,
    { introduction },
  );
  return response;
};

export const modifyProfileAPI = async (profileImage: FormData) => {
  const response = await Authapi.patchForm(`/api/v1/user/mypage/profile`, profileImage);
  return response;
};
