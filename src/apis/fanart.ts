import { Authapi } from './core';
import { getGalleryListParams } from '../interface/gallery';

export const getCommunityFanArtListAPI = async (params: getGalleryListParams) => {
  const response = await Authapi.get('/api/v1/community/fan-art', { params });
  return response.data;
};

export const toggleFanArtLikeAPI = async (fanArtId: number) => {
  await Authapi.post(`/api/v1/community/fan-art/fan-art-like/${fanArtId}`);
};

export const getFanArtDetailAPI = async (fanArtId: number) => {
  const response = await Authapi.get(`/api/v1/community/fan-art/${fanArtId}`);
  return response.data;
};

export const deleteFanArtAPI = async (fanArtId: number) => {
  await Authapi.delete(`/api/v1/community/fan-art/${fanArtId}`);
};
