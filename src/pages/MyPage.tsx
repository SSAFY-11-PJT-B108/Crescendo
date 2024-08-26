import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as Crown } from '../assets/images/crown.svg';
import newjeans from '../assets/images/newjeans.png';
import { useParams } from 'react-router-dom';
import LeftInfo from '../components/mypage/LeftInfo';
import MyFeedList from '../components/mypage/MyFeedList';
import MyFanartList from '../components/mypage/MyFanArtList';
import MyGoodsList from '../components/mypage/MyGoodsList';

export default function MyPage() {
  const [isSelected, setIsSelected] = useState<'feed' | 'fanArt' | 'goods'>('feed');
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);

  const { id } = useParams<{ id: string }>();
  if (id === undefined || !/^[1-9]\d*$/.test(id)) {
    throw new Error('잘못된 접근입니다.');
  }
  const numericId = id ? parseInt(id, 10) : NaN;

  const updateIndicator = () => {
    const menuElement = menuRef.current;
    if (menuElement) {
      const activeLink = menuElement.querySelector('.active') as HTMLElement;
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setIndicatorStyle({
          left: offsetLeft + (offsetWidth - 160) / 2 + 'px', // Center the indicator
          display: 'block',
        });
      } else {
        setIndicatorStyle({ display: 'none' });
      }
    }
  };

  useEffect(() => {
    updateIndicator();
  }, [isSelected]);
  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, []);
  return (
    <div className="mypage">
      <div className="mypage_left">
        <LeftInfo />
      </div>
      <div className="mypage_center">
        <div className="myfavorite">
          <img src={newjeans} alt="최애" />
          <div className="crown">
            <Crown />
          </div>
          <div className="text">NewJeans</div>
          <div className="flex flex-row gap-2 mt-1">
            <button className="ml-auto w-32 bg-mainColor h-8 text-white flex justify-center items-center rounded-full">
              이미지 업로드
            </button>
            <button className="w-32 bg-subColor h-8 text-white flex justify-center items-center rounded-full">
              이미지 삭제
            </button>
          </div>
        </div>

        <div className="category">
          <div className="w-3/4 mx-auto space-between flex flex-row" ref={menuRef}>
            <div
              className={`item ${isSelected === 'feed' ? 'active' : ''}`}
              onClick={() => setIsSelected('feed')}
            >
              내 피드
            </div>
            <div
              className={`item ${isSelected === 'fanArt' ? 'active' : ''}`}
              onClick={() => setIsSelected('fanArt')}
            >
              내 팬아트
            </div>
            <div
              className={`item ${isSelected === 'goods' ? 'active' : ''}`}
              onClick={() => setIsSelected('goods')}
            >
              내 굿즈
            </div>
          </div>
          <div className="indicator" style={indicatorStyle}></div>
        </div>

        {isSelected === 'feed' && (
          <div className="mypage_feed">
            <MyFeedList userId={numericId} />
          </div>
        )}

        {isSelected === 'fanArt' && (
          <div className="mypage_fanart">
            <MyFanartList userId={numericId} />
          </div>
        )}

        {isSelected === 'goods' && (
          <div className="mypage_goods">
            <MyGoodsList userId={numericId} />
          </div>
        )}
      </div>
    </div>
  );
}
