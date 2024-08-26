import React, { useEffect } from 'react';
import ChallengeItem from './ChallengeItem';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import { getChallengeList } from '../../features/challenge/challengeSlice';

export default function ChallengeList() {
  const dispatch = useAppDispatch();
  const { currentPage, challengeLists } = useAppSelector(state => state.challenge);

  useEffect(() => {
    dispatch(getChallengeList({ page: currentPage, size: 10, title: '', sortBy: '' }));
  }, [dispatch, currentPage]);

  return (
    <div className="challenge-list">
      <div className="title">SHOW YOUR CHALLENGE!!</div>
      {challengeLists.length === 0 ? (
        <div className="flex flex-col gap-5">
          <div className="flex w-full text-4xl">아직 등록된 챌린지가 없습니다</div>{' '}
          <div className="flex w-full justify-center text-4xl">지금 참여하세요😀</div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-10 mx-auto w-9/12 justify-between">
          {challengeLists.map(challenge => (
            <ChallengeItem Challenge={challenge} key={challenge.challengeId} />
          ))}
        </div>
      )}
    </div>
  );
}
