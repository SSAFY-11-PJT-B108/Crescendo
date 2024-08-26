import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import { ReactComponent as RightBtn } from '../../assets/images/right.svg';
import { ReactComponent as LeftBtn } from '../../assets/images/left.svg';
import CommunityCard from './CommunityCard';
import { CommunityInfo } from '../../interface/communityList';
import { getFavoriteListAPI } from '../../apis/community';

export default function CommunityFavoriteList() {
  // 상수 또는 변수(상태) 초기화
  const SIZE_PER_PAGE = 4;
  const MOVE_STEP = 4;

  const [idx, setIdx] = useState<number>(-1);
  const [communityList, setCommunityList] = useState<CommunityInfo[]>([]);
  const [showList, setShowList] = useState<CommunityInfo[]>([]);

  // 리스트 불러오기
  useEffect(() => {
    const getFavoriteList = async () => {
      try {
        const response = await getFavoriteListAPI();
        setCommunityList(response);
        setIdx(0); // 데이터가 로드되면 idx를 0으로 설정
      } catch (error) {
        console.error('Failed to fetch favorite list:', error);
      }
    };

    getFavoriteList();
  }, []);

  useEffect(() => {
    if (idx === -1) return;
    let tmp = [...communityList];
    tmp = tmp.slice(idx, idx + SIZE_PER_PAGE);
    setShowList(tmp);
  }, [communityList, idx]);

  function incrementIdx() {
    if (idx + SIZE_PER_PAGE + MOVE_STEP < communityList.length - 1)
      setIdx(prev => prev + MOVE_STEP);
    else {
      setIdx(communityList.length - SIZE_PER_PAGE);
    }
  }

  function decrementIdx() {
    if (idx - MOVE_STEP > 0) setIdx(prev => prev - MOVE_STEP);
    else {
      setIdx(0);
    }
  }

  return (
    <div className="communityfavoritelist_container">
      {
        <Button className={`square empty ${idx <= 0 ? 'hidden ' : ''}`} onClick={decrementIdx}>
          <LeftBtn />
        </Button>
      }
      <div className="communityfavoritelist_contents">
        {showList.length > 0 ? (
          showList.map(community => (
            <CommunityCard
              idolGroupId={community.idolGroupId}
              name={community.name}
              profile={community.profile}
              key={community.idolGroupId}
            />
          ))
        ) : (
          <div>"즐겨찾기 커뮤니티가 없습니다."</div>
        )}
      </div>
      {
        <Button
          className={`square empty ${idx >= communityList.length - 4 ? 'hidden ' : ''}`}
          onClick={incrementIdx}
        >
          <RightBtn />
        </Button>
      }
    </div>
  );
}
