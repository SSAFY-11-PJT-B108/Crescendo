import React, { useState } from 'react';
import { ReactComponent as Heart } from '../../assets/images/Feed/heart.svg';
import { ReactComponent as Dots } from '../../assets/images/Feed/dots.svg';
import { ReactComponent as Comment } from '../../assets/images/Feed/comment.svg';
import { ReactComponent as FullHeart } from '../../assets/images/Feed/fullheart.svg';
import { ReactComponent as RightBtn } from '../../assets/images/right.svg';
import { ReactComponent as LeftBtn } from '../../assets/images/left.svg';
import { FeedInfo } from '../../interface/feed';
import { useAppDispatch } from '../../store/hooks/hook';
import { toggleFeedLike } from '../../features/communityDetail/communityDetailSlice';
import UserProfile from '../common/UserProfile';
import { getUserId, IMAGE_BASE_URL } from '../../apis/core';
import Button from '../common/Button';
import ActionMenu from '../common/ActionMenu';

interface FeedProps {
  feed: FeedInfo;
  onClick: () => void;
  onEditAction: (feedId: number) => void;
  onDeleteAction: (feedId: number) => void;
}

export default function CommunityFeed({ feed, onClick, onEditAction, onDeleteAction }: FeedProps) {
  const {
    feedId,
    userId,
    profileImagePath,
    nickname,
    createdAt,
    likeCnt,
    feedImagePathList,
    content,
    commentCnt,
    tagList,
    isLike,
  } = feed;
  const dispatch = useAppDispatch();
  const [imgIdx, setImgIdx] = useState<number>(0);
  const [animation, setAnimation] = useState<string>('');
  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
  const currentUserId = getUserId();

  const handleClick = () => {
    onClick();
  };

  return (
    <div className="feed" onClick={handleClick}>
      <div className="upper">
        <UserProfile
          userId={userId}
          userNickname={nickname}
          date={new Date(createdAt).toLocaleString()}
          userProfilePath={profileImagePath ? IMAGE_BASE_URL + profileImagePath : null}
        />
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
                onEditAction={() => onEditAction(feedId)}
                onDeleteAction={() => onDeleteAction(feedId)}
              />
            )}
          </div>
        )}
      </div>
      {feedImagePathList.length > 0 && (
        <div className="feed_image_box">
          <div className="slider">
            <div onClick={e => e.stopPropagation()}>
              <Button
                className={`square empty ${imgIdx <= 0 ? 'hidden ' : ''}`}
                onClick={() => {
                  setAnimation('slideRight');
                  setImgIdx(prev => prev - 1);
                }}
              >
                <LeftBtn />
              </Button>
            </div>
            <div className="main_img_container">
              {imgIdx > 0 && (
                <img
                  key={`prev-${imgIdx}`}
                  className={`prev_img ${animation}`}
                  src={IMAGE_BASE_URL + feedImagePathList[imgIdx - 1]}
                  alt="이미지 없음"
                />
              )}
              <img
                key={`main-${imgIdx}`}
                className={`main_img ${animation}`}
                src={IMAGE_BASE_URL + feedImagePathList[imgIdx]}
                alt="이미지 없음"
              />
              {imgIdx < feedImagePathList.length - 1 && (
                <img
                  key={`next-${imgIdx}`}
                  className={`next_img ${animation}`}
                  src={IMAGE_BASE_URL + feedImagePathList[imgIdx + 1]}
                  alt="이미지 없음"
                />
              )}
              <div className="image-counter">
                {imgIdx + 1}/{feedImagePathList.length}
              </div>
            </div>
            <div onClick={e => e.stopPropagation()}>
              <Button
                className={`square empty ${imgIdx >= feedImagePathList.length - 1 ? 'hidden ' : ''}`}
                onClick={() => {
                  setAnimation('slideLeft');
                  setImgIdx(prev => prev + 1);
                }}
              >
                <RightBtn />
              </Button>
            </div>
          </div>
          <div className="pagination-dots" onClick={e => e.stopPropagation()}>
            {feedImagePathList.map((_, idx) => (
              <div
                key={idx}
                className={`pagination-dot ${idx === imgIdx ? 'active' : ''}`}
                onClick={() => {
                  setAnimation('');
                  setImgIdx(idx);
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      <div className="text">{content}</div>
      <div className="tag">
        {tagList.map((tag, index) => (
          <div key={index}>#{tag}</div>
        ))}
      </div>
      <div className="feed_heart_box" onClick={e => e.stopPropagation()}>
        {likeCnt}
        {!isLike ? (
          <Heart
            className="hoverup"
            onClick={() => {
              dispatch(toggleFeedLike(feedId));
            }}
          />
        ) : (
          <FullHeart
            className="hoverup"
            onClick={() => {
              dispatch(toggleFeedLike(feedId));
            }}
          />
        )}
      </div>
      <div className="feed_comment_box">
        {' '}
        {commentCnt}
        <Comment className="hoverup" />
      </div>
    </div>
  );
}
