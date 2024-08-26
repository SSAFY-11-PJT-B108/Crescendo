import { Authapi } from './core';

export const followerAPI = async (userId: number) => {
  const response = await Authapi.get(`/api/v1/follow/user/${userId}/follower`);
  return response.data;
};

export const followingAPI = async (userId: number) => {
  const response = await Authapi.get(`/api/v1/follow/user/${userId}/following`);
  return response.data;
};

export const followAPI = async (userIdToFollow: number) => {
  const response = await Authapi.post(`/api/v1/follow`, { userIdToFollow });
  return response;
};
