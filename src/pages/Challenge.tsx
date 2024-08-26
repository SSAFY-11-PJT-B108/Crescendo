import React, { useCallback, useEffect, useRef } from 'react';
import VideoPlayer from '../components/challenge/VideoPlayer';
import { ReactComponent as Write } from '../assets/images/write.svg';
import ChallengeModal from '../components/challenge/ChallengeModal';
import { useAppDispatch, useAppSelector } from '../store/hooks/hook';
import {
  getChallengeList,
  setChallengePage,
  setSelectedChallenge,
} from '../features/challenge/challengeSlice';
import ChallengeItem from '../components/challenge/ChallengeItem';

export default function Challenge() {
  const dispatch = useAppDispatch();
  const loader = useRef<HTMLDivElement | null>(null);
  const { currentPage, challengeLists } = useAppSelector(state => state.challenge);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  useEffect(() => {
    dispatch(getChallengeList({ page: currentPage, size: 4, title: '', sortBy: '' }));
    return () => {
      dispatch(
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
    };
  }, [dispatch, currentPage]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        dispatch(setChallengePage());
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const option = {
      threshold: 0.1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  const handleOpenModal = () => {
    setIsModalOpen(prev => !prev);
  };

  return (
    <div className="challenge">
      <div className="left-box"></div>
      <div className="left">
        <VideoPlayer />
      </div>
      <div className="right">
        <div className="challenge-list">
          <div className="title">SHOW YOUR CHALLENGE!!</div>
          <div className="flex flex-wrap gap-10 mx-auto w-9/12 justify-between">
            {challengeLists.map(challenge => (
              <ChallengeItem Challenge={challenge} key={challenge.challengeId} />
            ))}
          </div>
          <div className="w-4 h-4" ref={loader}></div>
        </div>
      </div>
      <Write className="fixed right-12 bottom-12 cursor-pointer" onClick={handleOpenModal} />
      {isModalOpen ? <ChallengeModal onClose={handleOpenModal} isOpen={isModalOpen} /> : null}
    </div>
  );
}
