import { Authapi } from './core';
import { getGalleryListParams } from '../interface/gallery';

export const getCommunityGoodsListAPI = async (params: getGalleryListParams) => {
  const response = await Authapi.get('/api/v1/community/goods', { params });
  return response.data;
};

export const toggleGoodsLikeAPI = async (goodsId: number) => {
  await Authapi.post(`/api/v1/community/goods/goods-like/${goodsId}`);
};

export const getGoodsDetailAPI = async (goodsId: number) => {
  const response = await Authapi.get(`/api/v1/community/goods/${goodsId}`);
  return response.data;
};

export const deleteGoodsAPI = async (goodsId: number) => {
  await Authapi.delete(`/api/v1/community/goods/${goodsId}`);
};
