import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../store/hooks/hook';
import CommunityFeed from './CommunityFeed';
import { useAppDispatch } from '../../store/hooks/hook';
import { getFeedList, resetState } from '../../features/communityDetail/communityDetailSlice';
import EditFeed from './EditFeed';
import CommonModal from '../common/CommonModal';
import { deleteFeedAPI } from '../../apis/feed';

interface CommunityFeedListProps {
  idolGroupId: number;
  onFeedClick: (feedId: number) => void;
}

interface EditModalProps {
  content: string;
  tags: string[];
  images: string[];
}

export default function CommunityFeedList({ idolGroupId, onFeedClick }: CommunityFeedListProps) {
  const { feedList, hasMore, status, keyword } = useAppSelector(state => state.communityDetail);
  const dispatch = useAppDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const [showEditModal, setShowEditModal] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [editModalProps, setEditModalProps] = useState<EditModalProps | null>(null);

  useEffect(() => {
    const feed = feedList.find(feed => feed.feedId === showEditModal);
    if (feed) {
      setEditModalProps({
        content: feed.content,
        tags: feed.tagList,
        images: feed.feedImagePathList,
      });
    } else setEditModalProps(null);
  }, [showEditModal, feedList]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
      if (observer.current) observer.current.disconnect();
    };
  }, [dispatch]);

  const loadMoreElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && (status === 'success' || status === '')) {
          dispatch(getFeedList(idolGroupId));
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, dispatch, status, idolGroupId],
  );

  const onDelete = useCallback(async () => {
    if (showDeleteModal) {
      try {
        await deleteFeedAPI(showDeleteModal);
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

  return (
    <div className="feedlist">
      {status === 'loading' || feedList.length > 0 ? (
        feedList.map(feed => (
          <CommunityFeed
            key={feed.feedId}
            feed={feed}
            onClick={() => onFeedClick(feed.feedId)}
            onEditAction={feedId => setShowEditModal(feedId)}
            onDeleteAction={feedId => setShowDeleteModal(feedId)}
          />
        ))
      ) : keyword ? (
        <div className="text-center text-xl">'{keyword}'에 해당하는 피드를 찾을 수 없습니다.</div>
      ) : (
        <div className="text-center text-xl">작성된 피드가 없습니다.</div>
      )}
      {
        //수정모달
        showEditModal && (
          <div
            className="modal-overlay"
            style={{ zIndex: 1100 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="feed-edit-modal modal">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-header-title">
                    <h2>글 수정</h2>
                  </div>
                  <span className="close" onClick={() => setShowEditModal(null)}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <EditFeed
                    onClose={() => {
                      setShowEditModal(null);
                    }}
                    feedId={showEditModal}
                    initialContent={editModalProps?.content ?? ''}
                    initialTags={editModalProps?.tags ?? []}
                    initialImages={editModalProps?.images ?? []}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }

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

      {hasMore && <div ref={loadMoreElementRef}>Load More..</div>}
    </div>
  );
}
