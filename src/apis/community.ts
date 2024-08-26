import { api, Authapi } from './core';
import {
  CommunityListResponse,
  CommunityInfo,
  CommunityDetailInfo,
} from '../interface/communityList';

export const getCommunityListAPI = async (page: number, size: number, keyword: string) => {
  const params = {
    page,
    size,
    keyword,
  };
  const response = await api.get(`/api/v1/community`, { params });
  return response.data as CommunityListResponse;
};

export const getFavoriteListAPI = async () => {
  const params = {
    page: 0,
    size: 1000,
  };

  const response = await Authapi.get('/api/v1/community/favorites', { params });

  return response.data.content as CommunityInfo[];
};

export const toggleFavoriteAPI = async (idolGroupId: number) => {
  try {
    await Authapi.post(`/api/v1/community/favorites/idol-group/${idolGroupId}`);
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
};

export const getCommunityDetailAPI = async (idolGroupId: number) => {
  const response = await Authapi.get(`/api/v1/community/idol-group/${idolGroupId}`);
  return response.data as CommunityDetailInfo;
};
