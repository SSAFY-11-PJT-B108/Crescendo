import React, { useRef, useState } from 'react';
import { ReactComponent as Participant } from '../../assets/images/challenge/participant.svg';
import { ReactComponent as Timer } from '../../assets/images/challenge/timer.svg';
import { ReactComponent as Play } from '../../assets/images/challenge/playbtn.svg';
import { ReactComponent as Enter } from '../../assets/images/challenge/enter.svg';
import { ReactComponent as Trash } from '../../assets/images/challenge/trash.svg';
import { Challenge } from '../../interface/challenge';
import { IMAGE_BASE_URL, getUserId } from '../../apis/core';
import { useAppDispatch } from '../../store/hooks/hook';
import { deleteChallenge, setSelectedChallenge } from '../../features/challenge/challengeSlice';
import { Link } from 'react-router-dom';
import { deleteChallengeAPI } from '../../apis/challenge';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ChallengeProps {
  Challenge: Challenge;
}
export default function ChallengeItem({ Challenge }: ChallengeProps) {
  const dispath = useAppDispatch();
  const { title, challengeVideoPath, participants, challengeId, userId } = Challenge;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current?.duration;
      setDuration(videoDuration);
    }
  };

  const handlePlayClick = () => {
    dispath(setSelectedChallenge(Challenge));
  };

  const handleDeleteChallenge = async () => {
    try {
      await deleteChallengeAPI(challengeId);
      dispath(deleteChallenge(challengeId));
      toast.success('삭제되었습니다', {
        position: 'top-center',
      });
      dispath(
        setSelectedChallenge({
          challengeId: 0,
          title: '',
          challengeVideoPath: '',
          createdAt: '',
          endAt: '',
          userId: 0,
          nickname: '',
          profilePath: '',
          participants: 0,
        }),
      );
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        // Axios 에러인 경우
        toast.info(`${err.response?.data}`, {
          position: 'top-right',
        });
      }
    }
  };

  return (
    <div className="challengeitem">
      <div className="item-box">
        <video
          src={`${IMAGE_BASE_URL}${challengeVideoPath}`}
          onLoadedMetadata={handleLoadedMetadata}
          ref={videoRef}
        />
        <div className="info">
          <ul>
            <li>
              <Link to={`/dance/${challengeId}`}>
                <Enter />
              </Link>{' '}
              <Link to={`/dance/${challengeId}`}>입장하기 </Link>
            </li>
            <li>
              <Timer /> {`${Math.floor(duration)}초`}
            </li>
            <li>
              <Participant /> {participants}
            </li>
          </ul>
          {userId === getUserId() && (
            <Trash
              className="absolute right-3 top-3 cursor-pointer"
              onClick={handleDeleteChallenge}
            />
          )}

          <div className="challengeitem_title">{title}</div>
        </div>
        <div className="big-play-button">
          <Play className="w-20 h-20" onClick={handlePlayClick} />
        </div>
      </div>
    </div>
  );
}
