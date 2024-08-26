import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../store/hooks/hook';
import { useAppDispatch } from '../../store/hooks/hook';
import { getGoodsList, resetState } from '../../features/communityDetail/communityDetailSlice';
import CommunityGoods from './CommunityGoods';
import CommonModal from '../common/CommonModal';
import EditGoods from './EditGoods';
import { deleteGoodsAPI } from '../../apis/goods';

interface CommunityGoodsListProps {
  idolGroupId: number;
  onGoodsClick: (goodsId: number) => void;
}

interface EditModalProps {
  title: string;
  content: string;
  images: string[];
}

export default function CommunityGoodsList({ idolGroupId, onGoodsClick }: CommunityGoodsListProps) {
  const { goodsList, hasMore, status, keyword } = useAppSelector(state => state.communityDetail);
  const dispatch = useAppDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const [showEditModal, setShowEditModal] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [editModalProps, setEditModalProps] = useState<EditModalProps | null>(null);

  useEffect(() => {
    const goods = goodsList.find(goods => goods.goodsId === showEditModal);
    if (goods) {
      setEditModalProps({
        title: goods.title,
        content: goods.content,
        images: goods.goodsImagePathList,
      });
    } else setEditModalProps(null);
  }, [showEditModal, goodsList]);

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
          dispatch(getGoodsList(idolGroupId));
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
        await deleteGoodsAPI(showDeleteModal);
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
      {status === 'loading' || goodsList.length > 0 ? (
        goodsList.map(goods => (
          <CommunityGoods
            key={goods.goodsId}
            goods={goods}
            onClick={() => onGoodsClick(goods.goodsId)}
            onEditAction={goodsId => setShowEditModal(goodsId)}
            onDeleteAction={goodsId => setShowDeleteModal(goodsId)}
          />
        ))
      ) : keyword ? (
        <div className="text-center text-xl w-full">
          '{keyword}'에 해당하는 굿즈를 찾을 수 없습니다.
        </div>
      ) : (
        <div className="text-center text-xl w-full">작성된 굿즈가 없습니다.</div>
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
                  <EditGoods
                    onClose={() => {
                      setShowEditModal(null);
                    }}
                    goodsId={showEditModal}
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
