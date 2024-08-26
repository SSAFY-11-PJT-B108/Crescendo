import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import { ReactComponent as Dots } from '../../assets/images/Favorite/smalldots.svg';
import { ReactComponent as Heart } from '../../assets/images/Favorite/heart.svg';
import { ReactComponent as FullHeart } from '../../assets/images/Favorite/fullheart.svg';
import { getUserId, IMAGE_BASE_URL } from '../../apis/core';
import UserProfile from '../common/UserProfile';
import {
  getFavoriteRankList,
  resetState,
  toggleIsLike,
} from '../../features/favorite/favoriteSlice';
import ActionMenu from '../common/ActionMenu';
import { deleteFavoriteRankAPI } from '../../apis/favorite';
import CommonModal from '../common/CommonModal';

export default function FavoriteRankList() {
  const { favoriteRankList, status, hasMore } = useAppSelector(state => state.favorite);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const userId = getUserId();

  useEffect(() => {
    return () => {
      dispatch(resetState());
      if (observer.current) observer.current.disconnect();
    };
  }, [dispatch]);

  const onDelete = useCallback(async () => {
    if (showDeleteModal) {
      try {
        await deleteFavoriteRankAPI(showDeleteModal);
        alert('성공적으로 삭제했습니다.');
        dispatch(resetState());
      } catch (error: any) {
        if (error.response && error.response.data) {
          alert(error.response.data);
          return;
        } else {
          alert('삭제에 실패했습니다.');
        }
      } finally {
        setShowDeleteModal(null);
      }
    }
  }, [showDeleteModal, dispatch]);

  const loadMoreElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && (status === 'success' || status === '')) {
          dispatch(getFavoriteRankList());
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, dispatch, status],
  );

  return (
    <div className="favoriteranklist">
      {favoriteRankList.map(rankEntry => (
        <div className="favoriteranklist_card" key={rankEntry.favoriteRankId}>
          {userId === rankEntry.writerId && (
            <div className="dotsbox">
              <Dots
                className="hoverup"
                onClick={() => setShowActionMenu(rankEntry.favoriteRankId)}
              />
              {showActionMenu === rankEntry.favoriteRankId && (
                <ActionMenu
                  onClose={() => setShowActionMenu(null)}
                  onDeleteAction={() => setShowDeleteModal(rankEntry.favoriteRankId)}
                />
              )}
            </div>
          )}
          <div className="favoriteranklist_card_label text-4xl">
            <div>{rankEntry.idolGroupName}</div>
            <div className="separator mx-3">-</div>
            <div>{rankEntry.idolName}</div>
          </div>
          <img src={IMAGE_BASE_URL + rankEntry.favoriteIdolImagePath} alt={rankEntry.idolName} />
          <div className="favoriteranklist_card_info">
            <UserProfile
              className="favoriteranklist_card_user"
              userId={rankEntry.writerId}
              userNickname={rankEntry.writerNickname}
              userProfilePath={IMAGE_BASE_URL + rankEntry.writerProfilePath}
              date={new Date(rankEntry.createdAt).toLocaleString()}
            />
            <div className="heartbox">
              {rankEntry.likeCnt}
              {rankEntry.isLike ? (
                <FullHeart
                  className="hoverup"
                  onClick={() => dispatch(toggleIsLike(rankEntry.favoriteRankId))}
                />
              ) : (
                <Heart
                  className="hoverup"
                  onClick={() => dispatch(toggleIsLike(rankEntry.favoriteRankId))}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      {
        //삭제모달
        showDeleteModal && (
          <CommonModal
            title="삭제 확인"
            msg="정말로 삭제하시겠습니까?"
            onClose={() => setShowDeleteModal(null)}
            onConfirm={onDelete}
          />
        )
      }
      {(status === 'success' || status === '') && hasMore && (
        <div ref={loadMoreElementRef}>Load More..</div>
      )}
    </div>
  );
}
