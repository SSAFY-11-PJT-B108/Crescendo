import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authapi, getUserId } from '../../apis/core';
import { useAppDispatch } from '../../store/hooks/hook';
import { toggleGoodsLike } from '../../features/communityDetail/communityDetailSlice';
import { ReactComponent as FeedHeartIcon } from '../../assets/images/Feed/white_heart.svg';
import { ReactComponent as FeedFullHeartIcon } from '../../assets/images/Feed/white_fullheart.svg';
import { ReactComponent as CommentHeartIcon } from '../../assets/images/Feed/heart.svg';
import { ReactComponent as CommentFullHeartIcon } from '../../assets/images/Feed/fullheart.svg';
import { ReactComponent as FeedMenuIcon } from '../../assets/images/Feed/white_dots.svg';
import { ReactComponent as CommentMenuIcon } from '../../assets/images/Feed/dots.svg';
import { ReactComponent as NextButton } from '../../assets/images/Feed/next_button.svg';
import { ReactComponent as PrevButton } from '../../assets/images/Feed/prev_button.svg';
import { ReactComponent as UserProfileImageDefault } from '../../assets/images/UserProfile/reduser.svg';
import { ReactComponent as ReplyIcon } from '../../assets/images/Feed/comment.svg';
import { ReactComponent as CommentWriteButton } from '../../assets/images/white_write.svg';
import { ReactComponent as NoComments } from '../../assets/images/text_bubble.svg';
import GoodsDetailMenu from './DropdownMenu';
import CommentMenu from './DropdownMenu';
import ReplyMenu from './DropdownReplyMenu';
import EditGoods from './EditGoods';
import '../../scss/components/community/_feeddetailmodal.scss';

const MAX_COMMENT_LENGTH = 50;

type GoodsDetailResponse = {
  userId: number;
  profileImagePath: string;
  nickname: string;
  createdAt: string;
  updatedAt?: string;
  likeCnt: number;
  isLike?: boolean;
  goodsImagePathList: string[];
  content: string;
  commentCnt: number;
  title: string;
};

type Comment = {
  goodsCommentId: number;
  userId: number;
  nickname: string;
  profileImagePath: string | null;
  content: string;
  createdAt: string;
  replyCnt: number;
  likeCnt: number;
  isLike?: boolean;
  replies?: Reply[];
};

type GoodsDetailModalProps = {
  show: boolean;
  onClose: () => void;
  goodsId: number;
};

type Reply = {
  goodsCommentId: number;
  writerId: number;
  profileImagePath: string | null;
  nickname: string;
  likeCnt: number;
  isLike?: boolean;
  content: string;
  createdAt: string;
};

const GoodsDetailModal: React.FC<GoodsDetailModalProps> = ({ show, onClose, goodsId }) => {
  const [goodsDetail, setgoodsDetail] = useState<GoodsDetailResponse | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState<{ [key: number]: string }>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [replyVisibility, setReplyVisibility] = useState<{ [key: number]: boolean }>({});
  const [replyInputVisibility, setReplyInputVisibility] = useState<{ [key: number]: boolean }>({});
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUserId = getUserId();

  const loadgoodsDetail = useCallback(async () => {
    try {
      const response = await Authapi.get(`/api/v1/community/goods/${goodsId}`);
      setgoodsDetail(response.data);
    } catch (error) {
      console.error('Error fetching feed details:', error);
    }
  }, [goodsId]);

  // 댓글 가져오기
  const loadComments = useCallback(async () => {
    try {
      const response = await Authapi.get(`/api/v1/community/goods/${goodsId}/comment`, {
        params: { page: 0, size: 100 },
      });
      setComments(response.data.content);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [goodsId]);

  // 답글 가져오기
  const loadReplies = useCallback(
    async (commentId: number) => {
      try {
        const response = await Authapi.get(
          `/api/v1/community/goods/${goodsId}/comment/${commentId}/reply`,
          {
            params: { page: 0, size: 100 },
          },
        );

        setComments(prevComments =>
          prevComments.map(comment =>
            comment.goodsCommentId === commentId
              ? { ...comment, replies: response.data.content }
              : comment,
          ),
        );
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    },
    [goodsId],
  );

  // 댓글 작성 제한
  const handleNewCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');

    if (lines.length > 10) {
      alert('10줄 이하로만 작성 가능합니다.');
      return;
    }

    if (value.length <= MAX_COMMENT_LENGTH) {
      setNewComment(value);
    }
  };

  // 답글 작성 제한
  const handleNewReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>, commentId: number) => {
    const value = e.target.value;
    const lines = value.split('\n');

    if (lines.length > 5) {
      alert('5줄 이하로만 작성 가능합니다.');
      return;
    }

    if (value.length <= MAX_COMMENT_LENGTH) {
      setNewReply(prevState => ({
        ...prevState,
        [commentId]: value,
      }));
    }
  };

  useEffect(() => {
    if (show) {
      setComments([]);
      loadgoodsDetail();
      loadComments();
    }
  }, [show, goodsId, loadComments, loadgoodsDetail]);

  useEffect(() => {
    if (!show) {
      setEditingCommentId(null);
      setEditedContent('');
      setActiveMenuId(null);
    }
  }, [show]);

  useEffect(() => {
    if (editingCommentId !== null) {
      const textarea = document.querySelector(
        '.reply-edit-input, .comment-edit-input, .reply-input-textarea',
      );
      if (textarea) {
        adjustTextareaHeight(textarea as HTMLTextAreaElement);
      }
    }
  }, [editingCommentId]);

  const handlePrevImage = () => {
    setActiveImageIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : goodsDetail!.goodsImagePathList.length - 1,
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex(prevIndex =>
      prevIndex < goodsDetail!.goodsImagePathList.length - 1 ? prevIndex + 1 : 0,
    );
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    const formData = new FormData();
    formData.append('content', newComment);

    Authapi.post(`/api/v1/community/goods/${goodsId}/comment`, formData)
      .then(() => {
        setNewComment('');
        const textarea = document.querySelector(
          '.comment-input-container textarea',
        ) as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = '40px';
        }
        loadComments();
      })
      .catch(error => {
        console.error('댓글 작성 오류:', error);
      });
  };

  const handleAddReply = (commentId: number) => {
    if (!currentUserId) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    const replyContent = newReply[commentId]?.trim();
    if (!replyContent) return;

    const formData = new FormData();
    formData.append('content', replyContent);

    Authapi.post(`/api/v1/community/goods/${goodsId}/comment/${commentId}/reply`, formData)
      .then(() => {
        setNewReply(prevState => ({ ...prevState, [commentId]: '' }));
        loadReplies(commentId);
      })
      .catch(error => {
        console.error('답글 작성 오류:', error);
      });
  };

  const handleFeedLikeToggle = () => {
    if (goodsDetail) {
      dispatch(toggleGoodsLike(goodsId));
      setgoodsDetail(prevDetail =>
        prevDetail
          ? {
              ...prevDetail,
              isLike: !prevDetail.isLike,
              likeCnt: prevDetail.isLike ? prevDetail.likeCnt - 1 : prevDetail.likeCnt + 1,
            }
          : prevDetail,
      );
    }
  };

  // 댓글, 답글 좋아요
  const handleLikeToggle = (commentId: number) => {
    let updatedComments;

    const commentIndex = comments.findIndex(
      comment =>
        comment.goodsCommentId === commentId ||
        (comment.replies && comment.replies.some(reply => reply.goodsCommentId === commentId)),
    );

    if (commentIndex === -1) return;

    const comment = comments[commentIndex];

    // 답글인지 댓글인지 확인
    if (comment.goodsCommentId === commentId) {
      // 댓글일 경우
      const updatedComment = {
        ...comment,
        isLike: !comment.isLike,
        likeCnt: comment.isLike ? comment.likeCnt - 1 : comment.likeCnt + 1,
      };
      updatedComments = [...comments];
      updatedComments[commentIndex] = updatedComment;
    } else {
      // 답글일 경우
      const replyIndex = comment.replies!.findIndex(reply => reply.goodsCommentId === commentId);
      if (replyIndex === -1) return;

      const originalReply = comment.replies![replyIndex];
      const updatedReply = {
        ...originalReply,
        isLike: !originalReply.isLike,
        likeCnt: originalReply.isLike ? originalReply.likeCnt - 1 : originalReply.likeCnt + 1,
      };

      const updatedReplies = [...(comment.replies || [])];
      updatedReplies[replyIndex] = updatedReply;

      updatedComments = [...comments];
      updatedComments[commentIndex] = {
        ...comment,
        replies: updatedReplies,
      };
    }

    setComments(updatedComments);

    Authapi.post(`/api/v1/community/goods/goods-comment-like/${commentId}`).catch(error => {
      console.error('좋아요 실패:', error);

      setComments(prevComments =>
        prevComments.map((comment, idx) => {
          if (idx !== commentIndex) return comment;

          if (comment.goodsCommentId === commentId) {
            return {
              ...comment,
              isLike: !comment.isLike,
              likeCnt: comment.isLike ? comment.likeCnt + 1 : comment.likeCnt - 1,
            };
          } else {
            const rollbackReplies = comment.replies!.map(reply =>
              reply.goodsCommentId === commentId
                ? {
                    ...reply,
                    isLike: !reply.isLike,
                    likeCnt: reply.isLike ? reply.likeCnt + 1 : reply.likeCnt - 1,
                  }
                : reply,
            );
            return {
              ...comment,
              replies: rollbackReplies,
            };
          }
        }),
      );
    });
  };

  const handleMenuToggle = (goodsId: number) => {
    if (activeMenuId === goodsId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(goodsId);
    }
  };

  const handleCommentMenuToggle = (commentId: number) => {
    if (activeMenuId === commentId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(commentId);
    }
  };

  const handleReplyToggle = (commentId: number) => {
    if (replyVisibility[commentId]) {
      setReplyVisibility(prevState => ({ ...prevState, [commentId]: false }));
    } else {
      loadReplies(commentId);
      setReplyVisibility(prevState => ({ ...prevState, [commentId]: true }));
    }
  };

  const handleReplyInputToggle = (commentId: number) => {
    setReplyInputVisibility(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleEdit = () => {
    setActiveMenuId(null);
    setEditModalVisible(true);
  };

  const handleEditModalClose = async () => {
    await loadgoodsDetail();
    setEditModalVisible(false);
  };

  // 피드 삭제
  const handleDelete = async () => {
    setActiveMenuId(null);
    const confirmDelete = window.confirm('삭제 후에는 복구가 불가능합니다. 정말 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await Authapi.delete(`/api/v1/community/goods/${goodsId}`);
        alert('삭제되었습니다.');
        navigate(0);
        onClose();
      } catch (error) {
        console.error('피드 삭제 오류:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  // 댓글 수정 모드로 전환
  const handleCommentEditClick = (commentId: number, currentContent: string) => {
    handleCommentMenuToggle(commentId);
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  // 답글 수정 모드로 정ㄴ환
  const handleReplyEditClick = (replyId: number, currentContent: string) => {
    handleCommentMenuToggle(replyId);
    setEditingCommentId(replyId);
    setEditedContent(currentContent);
  };

  // 댓글 수정 모드 취소
  const handleCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  // 댓글 수정 완료
  const handleCommentEditSubmit = (commentId: number) => {
    if (editedContent.trim() === '') {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('content', editedContent);

    Authapi.patch(`/api/v1/community/goods/${goodsId}/comment/${commentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        setEditingCommentId(null);
        loadComments();
      })
      .catch(error => {
        console.error('댓글 또는 답글 수정 오류:', error);
        alert('수정에 실패했습니다.');
      });
  };

  // 댓글 삭제
  const handleCommentDelete = (commentId: number) => {
    const confirmDelete = window.confirm('댓글을 삭제하시겠습니까?');
    if (confirmDelete) {
      Authapi.delete(`/api/v1/community/goods/${goodsId}/comment/${commentId}`)
        .then(() => {
          loadComments();
        })
        .catch(error => {
          console.error('댓글 삭제 오류:', error);
        });
    }
  };

  const getAbsolutePath = (path: string | null) => {
    return path ? `https://www.crescendo.o-r.kr/server/files/${path}` : '';
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto'; // 초기 높이를 auto로 설정
    textarea.style.height = `${textarea.scrollHeight}px`; // scrollHeight에 맞게 높이를 설정
    if (textarea.value === '') {
      textarea.style.height = '40px'; // 기본 높이로 설정
    }
  };

  const handleClose = () => {
    // 댓글 입력 필드 초기화
    setNewComment('');
    setNewReply({});

    // textarea 높이 복원
    const commentTextarea = document.querySelector(
      '.comment-input-container textarea',
    ) as HTMLTextAreaElement;
    if (commentTextarea) {
      commentTextarea.style.height = '40px'; // 기본 높이로 복구
    }

    // onClose 콜백 호출 (부모 컴포넌트에서 전달된)
    onClose();
  };

  if (!show || !goodsDetail) return null;

  return (
    <div className="feed-detail-modal modal-overlay">
      <div className={`modal-content ${editModalVisible ? 'blurred' : ''}`}>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <div className="feed-detail-left">
          <div className="feed-header">
            <div className="profile-image-container">
              {goodsDetail.profileImagePath ? (
                <img
                  src={getAbsolutePath(goodsDetail.profileImagePath)}
                  alt={goodsDetail.nickname}
                  className="profile-image"
                />
              ) : (
                <UserProfileImageDefault className="profile-image-default" />
              )}
            </div>
            <div className="profile-info">
              <div className="nickname">{goodsDetail.nickname}</div>
              <div className="feed-date">{new Date(goodsDetail.createdAt).toLocaleString()}</div>
            </div>
            <div className="feed-icons">
              <div className="feed-like-count">
                {goodsDetail.likeCnt > 99 ? '99+' : goodsDetail.likeCnt}
              </div>
              {goodsDetail.isLike ? (
                <FeedFullHeartIcon className="feed-heart-button" onClick={handleFeedLikeToggle} />
              ) : (
                <FeedHeartIcon className="feed-heart-button" onClick={handleFeedLikeToggle} />
              )}
              <FeedMenuIcon
                className={`feed-dots-button ${currentUserId === goodsDetail.userId ? 'visible' : ''}`}
                onClick={() => handleMenuToggle(goodsId)}
              />
              <div className="feed-menu">
                {activeMenuId === goodsId && (
                  <GoodsDetailMenu onEdit={handleEdit} onDelete={handleDelete} />
                )}
              </div>
            </div>
          </div>
          <div className="feed-body">
            <div className="slider-container">
              {goodsDetail.goodsImagePathList.length > 0 && (
                <div className="image-slider">
                  <PrevButton className="prev-button" onClick={handlePrevImage} />
                  <img
                    src={getAbsolutePath(goodsDetail.goodsImagePathList[activeImageIndex])}
                    alt="Feed"
                    draggable="false"
                  />
                  <NextButton className="next-button" onClick={handleNextImage} />
                  <div className="image-counter">{`${activeImageIndex + 1} / ${goodsDetail.goodsImagePathList.length}`}</div>
                </div>
              )}
            </div>
            <div className="feed-content-container">
              <div className="feed-title">{goodsDetail.title}</div>
              <div className="feed-content">{goodsDetail.content}</div>
            </div>
          </div>
        </div>
        <div className="feed-detail-right">
          <div className="comments" ref={commentsRef}>
            {comments.length === 0 ? (
              <div className="no-comments-container">
                <NoComments className="no-comments-icon" />
                <div className="no-comments-text">등록된 댓글이 없습니다...</div>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.goodsCommentId} className="comment">
                  <div className="comment-header">
                    <div className="comment-profile-image-container">
                      {comment.profileImagePath ? (
                        <img
                          src={getAbsolutePath(comment.profileImagePath)}
                          alt={comment.nickname}
                          className="comment-profile-image"
                        />
                      ) : (
                        <UserProfileImageDefault className="comment-profile-image-default" />
                      )}
                    </div>
                    <div className="comment-user-info">
                      <div className="comment-nickname">{comment.nickname}</div>
                      <div className="comment-date">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="comment-icons">
                      <div className="comment-like-count">
                        {comment.likeCnt > 99 ? '99+' : comment.likeCnt}
                      </div>
                      {comment.isLike ? (
                        <CommentFullHeartIcon
                          className="comment-heart-button"
                          onClick={() => handleLikeToggle(comment.goodsCommentId)}
                        />
                      ) : (
                        <CommentHeartIcon
                          className="comment-heart-button"
                          onClick={() => handleLikeToggle(comment.goodsCommentId)}
                        />
                      )}
                      <CommentMenuIcon
                        className={`comment-dots-button ${currentUserId === comment.userId ? 'visible' : ''}`}
                        onClick={() => handleCommentMenuToggle(comment.goodsCommentId)}
                      />
                      <div className="comment-menu">
                        {activeMenuId === comment.goodsCommentId && (
                          <CommentMenu
                            onEdit={() =>
                              handleCommentEditClick(comment.goodsCommentId, comment.content)
                            }
                            onDelete={() => handleCommentDelete(comment.goodsCommentId)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="comment-content">
                    {editingCommentId === comment.goodsCommentId ? (
                      <div className="editing-comment">
                        <textarea
                          className="comment-edit-input"
                          value={editedContent}
                          onChange={e => {
                            setEditedContent(e.target.value);
                            adjustTextareaHeight(e.target);
                          }}
                        />
                        <button
                          className="comment-edit-submit-button"
                          onClick={() => handleCommentEditSubmit(comment.goodsCommentId)}
                        >
                          수정
                        </button>
                        <button
                          className="comment-edit-exit-button"
                          onClick={handleCommentEditCancel}
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</div>
                    )}
                  </div>
                  <div className="reply-icon-container">
                    <ReplyIcon
                      className="reply-icon"
                      onClick={() => handleReplyToggle(comment.goodsCommentId)}
                    />
                    <div className="reply-count">
                      {comment.replyCnt}개의{' '}
                      <div
                        className="reply-input-toggle"
                        onClick={() => handleReplyInputToggle(comment.goodsCommentId)}
                      >
                        &nbsp;답글
                      </div>
                      {replyInputVisibility[comment.goodsCommentId] && (
                        <div className="reply-input-container">
                          <textarea
                            className="reply-input-textarea"
                            placeholder="여기에 입력하세요."
                            value={newReply[comment.goodsCommentId] || ''}
                            onChange={e => {
                              handleNewReplyChange(e, comment.goodsCommentId);
                              adjustTextareaHeight(e.target);
                            }}
                          />
                          <CommentWriteButton
                            className="reply-write-button"
                            onClick={() => handleAddReply(comment.goodsCommentId)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {replyVisibility[comment.goodsCommentId] &&
                    comment.replies &&
                    comment.replies.length > 0 && (
                      <div className="replies">
                        {comment.replies?.map((reply, index) => (
                          <div key={index} className="reply">
                            <div className="reply-header">
                              <div className="reply-profile-image-container">
                                {reply.profileImagePath ? (
                                  <img
                                    src={getAbsolutePath(reply.profileImagePath)}
                                    alt={reply.nickname}
                                    className="reply-profile-image"
                                  />
                                ) : (
                                  <UserProfileImageDefault className="reply-profile-image-default" />
                                )}
                              </div>
                              <div className="reply-user-info">
                                <div className="reply-nickname">{reply.nickname}</div>
                                <div className="reply-date">
                                  {new Date(reply.createdAt).toLocaleString()}
                                </div>
                              </div>
                              <div className="reply-icons">
                                <div className="reply-like-count">
                                  {reply.likeCnt > 99 ? '99+' : reply.likeCnt}
                                </div>
                                {reply.isLike ? (
                                  <CommentFullHeartIcon
                                    className="reply-heart-button"
                                    onClick={() => handleLikeToggle(reply.goodsCommentId)}
                                  />
                                ) : (
                                  <CommentHeartIcon
                                    className="reply-heart-button"
                                    onClick={() => handleLikeToggle(reply.goodsCommentId)}
                                  />
                                )}
                                <CommentMenuIcon
                                  className={`reply-dots-button ${currentUserId === reply.writerId ? 'visible' : ''}`}
                                  onClick={() => handleCommentMenuToggle(reply.goodsCommentId)}
                                />
                                <div className="reply-menu">
                                  {activeMenuId === reply.goodsCommentId && (
                                    <ReplyMenu
                                      onEdit={() =>
                                        handleReplyEditClick(reply.goodsCommentId, reply.content)
                                      }
                                      onDelete={() => handleCommentDelete(reply.goodsCommentId)}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="reply-content">
                              {editingCommentId === reply.goodsCommentId ? (
                                <div className="editing-reply">
                                  <textarea
                                    className="reply-edit-input"
                                    value={editedContent}
                                    onChange={e => {
                                      setEditedContent(e.target.value);
                                      adjustTextareaHeight(e.target);
                                    }}
                                  />
                                  <button
                                    className="reply-edit-submit-button"
                                    onClick={() => handleCommentEditSubmit(reply.goodsCommentId)}
                                  >
                                    수정
                                  </button>
                                  <button
                                    className="reply-edit-exit-button"
                                    onClick={handleCommentEditCancel}
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <div style={{ whiteSpace: 'pre-wrap' }}>{reply.content}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
          <div className="comment-input-container">
            <textarea
              placeholder="여기에 입력하세요."
              value={newComment}
              onChange={e => {
                handleNewCommentChange(e);
                adjustTextareaHeight(e.target as HTMLTextAreaElement);
              }}
            />
            <CommentWriteButton className="comment-write-button" onClick={handleAddComment} />
          </div>
        </div>
      </div>
      {editModalVisible && goodsDetail && (
        <div className="feed-edit-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-title">
                <h2>글 수정</h2>
              </div>
              <span className="close" onClick={handleEditModalClose}>
                &times;
              </span>
            </div>
            <div className="modal-body">
              <EditGoods
                onClose={handleEditModalClose}
                goodsId={goodsId}
                initialTitle={goodsDetail.title}
                initialContent={goodsDetail.content}
                initialImages={goodsDetail.goodsImagePathList}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodsDetailModal;
