import { Authapi } from './core';

export const postChallengeAPI = async (formData: FormData) => {
  const response = await Authapi.postForm('/api/v1/challenge', formData);
  return response;
};

export const getChallengeAPI = async (
  page: number,
  size: number,
  title: string,
  sortBy: string,
) => {
  const response = await Authapi.get(`/api/v1/challenge?page=${page}&size=${size}`);
  return response.data;
};

export const getChallengeDetailsAPI = async (
  page: number,
  size: number,
  nickname: string,
  sortBy: string,
  challengeId: number,
) => {
  const response = await Authapi.get(
    `/api/v1/challenge/${challengeId}/join?page=${page}&size=${size}&nickname=${nickname}&sortBy=${sortBy}`,
  );
  return response.data;
};

export const getChallengeOriginAPI = async (challengeId: number) => {
  const response = await Authapi.get(`/api/v1/challenge/${challengeId}`);
  return response.data;
};

export const getChallengeLikeAPI = async (challengeId: number) => {
  const response = await Authapi.post(`/api/v1/challenge/join/${challengeId}`);
  return response.data;
};

export const postChallengeJoinAPI = async (challengeId: number, formData: FormData) => {
  const response = await Authapi.postForm(`/api/v1/challenge/${challengeId}/join`, formData);
  return response;
};

export const deleteChallengeJoinAPI = async (challengeJoinId: number) => {
  const response = await Authapi.delete(`/api/v1/challenge/join/${challengeJoinId}`);
  return response;
};

export const deleteChallengeAPI = async (challengeId: number) => {
  const response = await Authapi.delete(`/api/v1/challenge/${challengeId}`);
  return response;
};
