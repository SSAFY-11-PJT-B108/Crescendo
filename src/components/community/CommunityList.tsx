import React, { useCallback, useEffect, useRef } from 'react';
import CommunityCard from './CommunityCard';
import { useAppSelector, useAppDispatch } from '../../store/hooks/hook';
import { getCommunityList, resetPage } from '../../features/communityList/communityListSlice';

export default function CommunityList() {
  const { communityList, page, hasMore, status } = useAppSelector(state => state.communityList);
  const dispatch = useAppDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const SIZE_PER_PAGE = 4;

  useEffect(() => {
    return () => {
      dispatch(resetPage());
      if (observer.current) observer.current.disconnect();
    };
  }, [dispatch]);

  const loadMoreElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && (status === 'success' || status === '')) {
          dispatch(getCommunityList({ page, size: SIZE_PER_PAGE }));
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, page, dispatch, status],
  );

  return (
    <div className="communitylist_contents">
      {communityList.map(community => (
        <CommunityCard
          idolGroupId={community.idolGroupId}
          name={community.name}
          profile={community.profile}
          key={community.idolGroupId}
        />
      ))}
      {hasMore && <div ref={loadMoreElementRef}>Load More..</div>}
    </div>
  );
}
