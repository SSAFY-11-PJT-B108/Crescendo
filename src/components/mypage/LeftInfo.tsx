import React, { useEffect } from 'react';
// import { getUserInfoAPI, modifyIntroductionAPI, modifyNicknameAPI } from '../../apis/user';
import { getUserId } from '../../apis/core';
import { useParams } from 'react-router-dom';
import Profile from './Profile';
import FriendList from './FriendList';
import { useAppDispatch } from '../../store/hooks/hook';
import { getUserInfo } from '../../features/mypage/profileSlice';

export default function LeftInfo() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserInfo({ pathId: Number(id), userId: getUserId() }));
  }, [dispatch, id]);
  return (
    <>
      <Profile userId={Number(id)} />
      <FriendList userId={Number(id)} />
    </>
  );
}
