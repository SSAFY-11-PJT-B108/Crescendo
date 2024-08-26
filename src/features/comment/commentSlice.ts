import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, Authapi } from '../../apis/core';

// 게시물 유형에 따라 API 경로를 동적으로 반환하는 함수
const getApiEndpoint = (type: string, postId: number) => {
  switch (type) {
    case 'feed':
      return `/api/v1/community/feed/${postId}/comment`;
    case 'goods':
      return `/api/v1/community/goods/${postId}/comment`;
    case 'fan-art':
      return `/api/v1/community/fan-art/${postId}/comment`;
    default:
      throw new Error('Unknown post type'); // 예상치 못한 게시물 유형이 주어지면 오류 발생
  }
};

// 댓글 조회 액션 (비동기)
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({
    type,
    postId,
    page,
    size,
  }: {
    type: string;
    postId: number;
    page: number;
    size: number;
  }) => {
    const endpoint = getApiEndpoint(type, postId); // 게시물 유형에 맞는 API 엔드포인트를 생성
    const response = await api.get(endpoint, {
      params: { page, size }, // 페이지와 사이즈를 기반으로 댓글 목록을 요청
    });
    return { type, postId, comments: response.data.content }; // 결과를 슬라이스로 반환하여 상태에 저장
  },
);

// 댓글 작성 액션 (비동기)
export const postComment = createAsyncThunk(
  'comments/postComment',
  async ({ type, postId, content }: { type: string; postId: number; content: string }) => {
    const endpoint = getApiEndpoint(type, postId); // 게시물 유형에 맞는 API 엔드포인트를 생성
    const formData = new FormData(); // 댓글 데이터를 전송하기 위해 FormData 사용
    formData.append('content', content);

    const response = await Authapi.post(endpoint, formData); // 댓글을 서버로 전송
    return { type, postId, comment: response.data }; // 새로 작성된 댓글을 반환하여 상태에 추가
  },
);

// Redux Slice 정의
const commentSlice = createSlice({
  name: 'comments', // 슬라이스의 이름
  initialState: {
    byTypeAndPostId: {} as { [key: string]: { [key: number]: Comment[] } }, // 댓글을 게시물 유형 및 ID에 따라 저장
    status: 'idle', // 요청 상태 ('idle', 'loading', 'succeeded', 'failed')
    error: null as string | null, // 오류 메시지 상태
  },
  reducers: {}, // 동기 액션을 정의할 수 있는 부분 (현재는 비어 있음)
  extraReducers: builder => {
    builder
      // 댓글 조회 액션이 성공했을 때 상태 업데이트
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { type, postId, comments } = action.payload;
        if (!state.byTypeAndPostId[type]) {
          state.byTypeAndPostId[type] = {};
        }
        state.byTypeAndPostId[type][postId] = comments; // 해당 게시물의 댓글 목록을 상태에 저장
      })
      // 댓글 작성 액션이 성공했을 때 상태 업데이트
      .addCase(postComment.fulfilled, (state, action) => {
        const { type, postId, comment } = action.payload;
        state.byTypeAndPostId[type][postId].push(comment); // 새로 작성된 댓글을 해당 게시물의 댓글 목록에 추가
      });
  },
});

// 이 슬라이스의 리듀서를 기본으로 내보냅니다.
export default commentSlice.reducer;
