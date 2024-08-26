import { useEffect, useState } from 'react';
import { BestPhotoInfo } from '../../interface/favorite';
import { getBestPhotoListAPI } from '../../apis/favorite';
import { IMAGE_BASE_URL } from '../../apis/core';

export default function BestPhotoSlide() {
  const [bestPhotoList, setBestPhotoList] = useState<BestPhotoInfo[]>([]);
  const [animationDuration, setAnimationDuration] = useState<number>(10);
  const [isAnimationActive, setIsAnimationActive] = useState<boolean>(false);
  const ANIMATION_SPEED = 150;

  useEffect(() => {
    const getBestPhotoList = async () => {
      let tmpPhotoList = await getBestPhotoListAPI();
      if (tmpPhotoList.length > 3) {
        setIsAnimationActive(true);
        tmpPhotoList = [...tmpPhotoList, ...tmpPhotoList];
      }
      setBestPhotoList(tmpPhotoList);
    };
    getBestPhotoList();
  }, []);

  useEffect(() => {
    if (bestPhotoList.length === 0) return;
    let totalWidth = bestPhotoList.length * 450;
    setAnimationDuration(totalWidth / ANIMATION_SPEED);
  }, [bestPhotoList]);

  return (
    <div className="bestphotoslide_container">
      <div className="bestphotoslide_title">Best Photos</div>
      {bestPhotoList.length > 0 ? (
        <div className="bestphotoslide_track_container">
          <div
            className="bestphotoslide_track"
            style={{
              animation: isAnimationActive ? `slide ${animationDuration}s linear infinite` : 'none',
            }}
          >
            {bestPhotoList.map((bestPhoto, idx) => (
              <div className="bestphotoslide_card" key={idx}>
                <img
                  src={IMAGE_BASE_URL + bestPhoto.favoriteIdolImagePath}
                  alt={bestPhoto.idolName}
                />
                <div className="bestphotoslide_card_label">
                  <div>{bestPhoto.idolGroupName}</div>
                  <div className="separator">-</div>
                  <div>{bestPhoto.idolName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bestphotoslide_nocard">
          <p>현재 투표 받은 최애 사진이 없어요 😅</p>
          <p>최애 자랑 갤러리에서 마음에 드는 사진을 투표해주세요</p>
        </div>
      )}
    </div>
  );
}
