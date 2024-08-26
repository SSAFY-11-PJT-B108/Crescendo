import React from 'react';
import { useAppSelector } from '../../store/hooks/hook';

import FriendProfile from './FriendProfile';
import { getUserId } from '../../apis/core';
interface FrinedsProps {
  userId: number;
}
export default function FollowingList({ userId }: FrinedsProps) {
  const { followingList, error } = useAppSelector(state => state.following);

  if (error === 'failed') {
    return <div>데이터를 가져오는 중 에러가 발생했습니다: {error}</div>;
  }

  return (
    <div className="profilelist">
      {followingList.length > 0
        ? followingList.map((following, index) => <FriendProfile key={index} user={following} />)
        : userId === getUserId() && <div>친구를 팔로잉 보세요!</div>}
    </div>
  );
}
