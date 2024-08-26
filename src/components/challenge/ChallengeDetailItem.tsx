import React, { useRef } from 'react';
import { ReactComponent as Heart } from '../../assets/images/challenge/heart.svg';
import { ReactComponent as FullHeart } from '../../assets/images/challenge/fullheart.svg';
import { ReactComponent as Play } from '../../assets/images/challenge/playbtn.svg';
import { ReactComponent as Trash } from '../../assets/images/challenge/trash.svg';
import { ChallengeDetails } from '../../interface/challenge';
import { IMAGE_BASE_URL, getUserId } from '../../apis/core';
import { useAppDispatch } from '../../store/hooks/hook';
import {
  decrementChallengeLike,
  deleteChallengeDetail,
  incrementChallengeLike,
  setSelectedChallengeDetail,
} from '../../features/challenge/challengeDetailSlice';
import { deleteChallengeJoinAPI, getChallengeLikeAPI } from '../../apis/challenge';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { decrementParticipants } from '../../features/challenge/challengeSlice';

interface ChallengeProps {
  Challenge: ChallengeDetails;
  challengeId: number;
}
export default function ChallengeDetailItem({ Challenge, challengeId }: ChallengeProps) {
  const { isLike, challengeVideoPath, likeCnt, nickname, challengeJoinId, userId } = Challenge;
  const dispath = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleClick = () => {
    dispath(setSelectedChallengeDetail(Challenge));
  };

  const handleNotLike = async () => {
    await getChallengeLikeAPI(challengeJoinId);
    dispath(decrementChallengeLike(challengeJoinId));
  };
  const handleLike = async () => {
    await getChallengeLikeAPI(challengeJoinId);
    dispath(incrementChallengeLike(challengeJoinId));
  };

  const handleRemove = async () => {
    try {
      await deleteChallengeJoinAPI(challengeJoinId);
      toast.success('삭제되었습니다', {
        position: 'top-right',
      });

      dispath(
        setSelectedChallengeDetail({
          challengeJoinId: 0,
          challengeVideoPath: '',
          isLike: false,
          likeCnt: 0,
          nickname: '',
          score: 0,
          userId: 0,
        }),
      );
      dispath(deleteChallengeDetail(challengeJoinId));
      dispath(decrementParticipants(challengeId));
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        // Axios 에러인 경우
        alert(err.response?.data);
      }
    }
  };

  return (
    <div className="challengedetailitem">
      <div className="item-box">
        <video src={`${IMAGE_BASE_URL}${challengeVideoPath}`} ref={videoRef} />
        <div className="info">
          <div className="flex flex-row gap-2 mx-3 my-3 text-white">
            {isLike ? (
              <FullHeart className="w-6 h-6" onClick={handleNotLike} />
            ) : (
              <Heart className="w-6 h-6" onClick={handleLike} />
            )}{' '}
            {likeCnt}
            {userId === getUserId() && (
              <Trash className="w-6 h-6 ml-auto cursor-pointer" onClick={handleRemove} />
            )}
          </div>
          <div className="challengeitem_title">{nickname}</div>
        </div>
        <div className="big-play-button">
          <Play className="w-20 h-20" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
}
