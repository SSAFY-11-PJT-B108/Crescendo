import React, { useState } from 'react';
import { ReactComponent as Dots } from '../../assets/images/Gallery/whitedots.svg';
import { ReactComponent as FullHeart } from '../../assets/images/Gallery/whitefullheart.svg';
import { ReactComponent as Heart } from '../../assets/images/Gallery/whiteheart.svg';
import { ReactComponent as Comment } from '../../assets/images/Gallery/whitecomment.svg';
import { GoodsInfo } from '../../interface/gallery';
import { getUserId, IMAGE_BASE_URL } from '../../apis/core';
import UserProfile from '../common/UserProfile';
import { useAppDispatch } from '../../store/hooks/hook';
import { toggleGoodsLike } from '../../features/communityDetail/communityDetailSlice';
import ActionMenu from '../common/ActionMenu';

interface GoodsProps {
  goods: GoodsInfo;
  onClick: () => void;
  onEditAction: (goodsId: number) => void;
  onDeleteAction: (goodsId: number) => void;
}

export default function CommunityGoods({
  goods,
  onClick,
  onDeleteAction,
  onEditAction,
}: GoodsProps) {
  const {
    goodsId,
    userId,
    profileImagePath,
    nickname,
    likeCnt,
    goodsImagePathList,
    commentCnt,
    createdAt,
    title,
    isLike,
  } = goods;

  const dispatch = useAppDispatch();
  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
  const currentUserId = getUserId();

  const handleClick = () => {
    onClick();
  };

  return (
    <div className="gallery" onClick={handleClick}>
      <img className="gallery-img" src={IMAGE_BASE_URL + goodsImagePathList[0]} alt="굿즈그림" />
      {userId === currentUserId && (
        <div className="dots_box">
          <Dots
            className="dots hoverup"
            onClick={e => {
              e.stopPropagation();
              setShowActionMenu(true);
            }}
          />
          {showActionMenu && (
            <ActionMenu
              onClose={() => setShowActionMenu(false)}
              onEditAction={() => onEditAction(goodsId)}
              onDeleteAction={() => onDeleteAction(goodsId)}
            />
          )}
        </div>
      )}
      <div className="title_box">
        <div className="type">굿즈</div>
        <div className="title">{title}</div>
      </div>
      <div className="gallery_info" onClick={e => e.stopPropagation()}>
        <div className="gallery_profile">
          <UserProfile
            userId={userId}
            userNickname={nickname}
            date={new Date(createdAt).toLocaleString()}
            userProfilePath={profileImagePath ? IMAGE_BASE_URL + profileImagePath : null}
          />
        </div>
        <div className="gallery_comment_box">
          <Comment className="gallery_comment" />
          <div className="gallery_comment_cnt">{commentCnt}</div>
        </div>
        <div className="gallery_heart_box">
          {isLike ? (
            <FullHeart
              className="gallery_heart hoverup"
              onClick={() => dispatch(toggleGoodsLike(goodsId))}
            />
          ) : (
            <Heart
              className="gallery_heart hoverup"
              onClick={() => dispatch(toggleGoodsLike(goodsId))}
            />
          )}
          <div className="gallery_heart_cnt">{likeCnt}</div>
        </div>
      </div>
    </div>
  );
}
