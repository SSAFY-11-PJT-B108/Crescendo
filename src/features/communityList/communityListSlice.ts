import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CommunityInfo, CommunityListResponse } from '../../interface/communityList';
import { getCommunityListAPI } from '../../apis/community';
import { RootState } from '../../store/store';

// 슬라이스의 상태 타입 정의
type PromiseStatus = 'loading' | 'success' | 'failed' | '';

interface CommunityListState {
  communityList: CommunityInfo[];
  status: PromiseStatus;
  error: string | null;
  page: number;
  hasMore: boolean;
  keyword: string;
}

const initialState: CommunityListState = {
  communityList: [],
  status: '',
  error: null,
  page: 0,
  hasMore: true,
  keyword: '',
};

// 전체 커뮤니티 리스트 가져오는 함수
export const getCommunityList = createAsyncThunk<CommunityListResponse, any, { state: RootState }>(
  'communityList/getCommunityList',
  async (_, thunkAPI) => {
    const { page, keyword } = thunkAPI.getState().communityList;
    const response = await getCommunityListAPI(page, 4, keyword);
    return response;
  },
);

const communityListSlice = createSlice({
  name: 'communityList',
  initialState,
  reducers: {
    resetPage() {
      return initialState;
    },

    setKeyword(state, action) {
      state.page = 0;
      state.communityList = [];
      state.hasMore = true;
      state.status = '';
      state.error = null;
      state.keyword = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCommunityList.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        getCommunityList.fulfilled,
        (state, action: PayloadAction<CommunityListResponse>) => {
          state.status = 'success';
          state.hasMore = !action.payload.last;
          state.communityList = [...state.communityList, ...action.payload.content];
          state.page += 1;
        },
      )
      .addCase(getCommunityList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch community list';
      });
  },
});

export const { resetPage, setKeyword } = communityListSlice.actions;

export default communityListSlice.reducer;
