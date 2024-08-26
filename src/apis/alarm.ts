import { Authapi } from './core';

export const getAlarmAPI = async (page: number, size: number) => {
  const response = await Authapi.get(`/api/v1/alarm?page=${page}&size=${size}`);
  return response.data;
};

export const getUnReadAlarmCountAPI = async () => {
  const response = await Authapi.get(`/api/v1/alarm/count`);
  return response.data;
};

export const readAlarm = async (alarmId: number) => {
  const response = await Authapi.patch(`/api/v1/alarm/${alarmId}/read`);
  return response;
};

export const deleteAlamrAPI = async (alarmId: number) => {
  const response = await Authapi.delete(`/api/v1/alarm/${alarmId}`);
  return response;
};
