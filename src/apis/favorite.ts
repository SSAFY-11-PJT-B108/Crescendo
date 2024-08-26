import { api, Authapi } from './core';
import {
  BestPhotoInfo,
  FavoriteRankListResponse,
  IdolGroupInfo,
  IdolInfo,
} from '../interface/favorite';
import { CommunityInfo } from '../interface/communityList';

export const getidolGroupListAPI = async () => {
  const response = await api.get('/api/v1/community', { params: { page: 0, size: 1000 } });
  const communityList: CommunityInfo[] = response.data.content;
  const idolGroupList: IdolGroupInfo[] = communityList.map(community => ({
    groupId: community.idolGroupId,
    groupName: community.name,
  }));
  return idolGroupList;
};

export const getIdolListAPI = async (idolGroupId: number) => {
  const response = await api.get(`/api/v1/idol/idol-group/${idolGroupId}/name`);
  const idolList: IdolInfo[] = response.data.idolList;
  return idolList;
};

export const getFavoriteRankListAPI = async (
  page: number,
  size: number,
  idolGroupId: number | null,
  idolId: number | null,
  sortByVotes: boolean,
) => {
  const params = {
    page,
    size,
    idolGroupId,
    idolId,
    sortByVotes,
  };
  const response = await Authapi.get(`/api/v1/favorite-rank`, { params });
  return response.data as FavoriteRankListResponse;
};

export const voteFavoriteRankAPI = async (favoriteRankId: number) => {
  const response = await Authapi.post(`/api/v1/favorite-rank/${favoriteRankId}/vote`);
  return response;
};

export const getBestPhotoListAPI = async () => {
  const response = await api.get('/api/v1/favorite-rank/bestphoto');
  const bestRankList: BestPhotoInfo[] = response.data.bestRankList;
  return bestRankList;
};

export const postFavoriteRankAPI = async (data: FormData) => {
  const response = await Authapi.post('/api/v1/favorite-rank', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const deleteFavoriteRankAPI = async (favoriteRankId: number) => {
  const response = await Authapi.delete(`/api/v1/favorite-rank/${favoriteRankId}`);
  return response;
};
