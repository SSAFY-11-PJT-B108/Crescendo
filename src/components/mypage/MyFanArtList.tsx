import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../store/hooks/hook';
import { useAppDispatch } from '../../store/hooks/hook';
import { getMyFanArtList, resetState } from '../../features/mypage/myFeedSlice';
import MyFanart from './MyFanart';
import { deleteFanArtAPI } from '../../apis/fanart';
import EditFanart from '../community/EditFanart';
import CommonModal from '../common/CommonModal';

interface MyFanArtListProps {
  userId: number;
}

interface EditModalProps {
  title: string;
  content: string;
  images: string[];
}

export default function MyFanartList({ userId }: MyFanArtListProps) {
  const { myFanArtList, hasMore, status } = useAppSelector(state => state.myFeed);
  const dispatch = useAppDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const [showEditModal, setShowEditModal] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [editModalProps, setEditModalProps] = useState<EditModalProps | null>(null);

  useEffect(() => {
    const fanArt = myFanArtList.find(fanArt => fanArt.fanArtId === showEditModal);
    if (fanArt) {
      setEditModalProps({
        title: fanArt.title,
        content: fanArt.content,
        images: fanArt.fanArtImagePathList,
      });
    } else setEditModalProps(null);
  }, [showEditModal, myFanArtList]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
      if (observer.current) observer.current.disconnect();
    };
  }, [dispatch, userId]);

  const loadMoreElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && (status === 'success' || status === '')) {
          dispatch(getMyFanArtList(userId));
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, dispatch, status, userId],
  );

  const onDelete = useCallback(async () => {
    if (showDeleteModal) {
      try {
        await deleteFanArtAPI(showDeleteModal);
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
    <div className="gallerylist">
      {status === 'loading' || myFanArtList.length > 0 ? (
        myFanArtList.map(fanArt => (
          <MyFanart
            key={fanArt.fanArtId}
            fanArt={fanArt}
            onEditAction={fanArtId => setShowEditModal(fanArtId)}
            onDeleteAction={fanArtId => setShowDeleteModal(fanArtId)}
          />
        ))
      ) : (
        <div className="text-center text-xl w-full">작성한 팬아트가 없습니다.</div>
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
                  <EditFanart
                    onClose={() => {
                      setShowEditModal(null);
                    }}
                    fanArtId={showEditModal}
                    initialTitle={editModalProps?.title ?? ''}
                    initialContent={editModalProps?.content ?? ''}
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
