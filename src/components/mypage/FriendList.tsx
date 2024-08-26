import React, { useEffect, useState } from 'react';
import SearchInput from '../common/SearchInput';

import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import { getUserFollower } from '../../features/mypage/followerSlice';
import { getUserFollowing } from '../../features/mypage/followingSlice';
import FollowingList from './FollowingList';
import Followerlist from './FollowerList';

interface FrinedsProps {
  userId: number;
}
type ModeState = 'follower' | 'following' | '';
export default function FriendList({ userId }: FrinedsProps) {
  const { userInfo } = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();
  const [isSelected, setIsSelected] = useState<ModeState>('');

  const handleModeClick = (mode: ModeState) => {
    setIsSelected(prevMode => (prevMode === mode ? '' : mode));
  };

  useEffect(() => {
    if (isSelected === 'follower') {
      dispatch(getUserFollower(userId));
    } else {
      dispatch(getUserFollowing(userId));
    }
  }, [dispatch, isSelected, userId]);

  return (
    <>
      <div className="friend">
        <div className="listbar">
          <div
            className={`follow left ${isSelected === 'following' ? 'active' : ''}`}
            onClick={() => handleModeClick('following')}
          >
            <span>{userInfo.followingNum}</span>
            <div>팔로잉</div>
          </div>
          <div
            className={`follow right ${isSelected === 'follower' ? 'active' : ''}`}
            onClick={() => handleModeClick('follower')}
          >
            <span>{userInfo.followerNum}</span>
            <div>팔로워</div>
          </div>
        </div>
      </div>
      {isSelected !== '' && (
        <div className="list">
          <SearchInput placeholder="친구를 검색하세요" className="mt-5 flex" />
          {isSelected === 'follower' ? (
            <Followerlist userId={userId} />
          ) : (
            <FollowingList userId={userId} />
          )}
        </div>
      )}
    </>
  );
}
