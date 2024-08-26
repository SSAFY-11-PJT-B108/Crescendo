import { Authapi } from './core';

export const chatroomlistAPI = async () => {
  const response = await Authapi.get(`/api/v1/dm/my-dm-group`);
  return response.data;
};

export const messagesAPI = async (
  UserId: number,
  page: number,
  size: number,
  dmGroupId: number,
) => {
  const response = await Authapi.get(
    `/api/v1/dm/dm-group/${dmGroupId}?loggedInUserId=${UserId}&page=${page}&size=${size}`,
  );
  return response.data;
};

export const createChatroom = async (opponentId: number) => {
  const response = await Authapi.post(`/api/v1/dm/dm-group`, { opponentId: opponentId });
  return response.data;
};

export const getOpponent = async (opponentId: number) => {
  const response = await Authapi.get(`/api/v1/dm/dm-group/user/${opponentId}`);
  return response;
};
