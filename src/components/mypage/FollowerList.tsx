import React from 'react';
import { useAppSelector } from '../../store/hooks/hook';
import FriendProfile from './FriendProfile';
import { getUserId } from '../../apis/core';

interface FrinedsProps {
  userId: number;
}

export default function Followerlist({ userId }: FrinedsProps) {
  const { followerList, error } = useAppSelector(state => state.follower);

  if (error === 'failed') {
    return <div>데이터를 가져오는 중 에러가 발생했습니다: {error}</div>;
  }

  return (
    <div className="profilelist">
      {followerList.length > 0
        ? followerList.map((follower, index) => <FriendProfile key={index} user={follower} />)
        : userId === getUserId() && <div>친구를 추가해 보세요!</div>}
    </div>
  );
}
