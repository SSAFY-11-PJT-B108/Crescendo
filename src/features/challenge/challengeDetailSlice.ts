import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getChallengeDetailsAPI } from '../../apis/challenge';
import { ChallengeDetails } from '../../interface/challenge';

export type PromiseStatus = 'loading' | 'success' | 'failed' | '';
interface ChallengeDetailProps {
  challengeDetailLists: ChallengeDetails[];
  status: PromiseStatus;
  error: string | undefined;
  currentPage: number;
  size: number;
  totalPage: number;
  selectedChallengeDetail: ChallengeDetails;
  comparePlay: boolean;
}
const inistalState: ChallengeDetailProps = {
  challengeDetailLists: [],
  status: '',
  error: '',
  currentPage: 0,
  totalPage: 1,
  size: 6,
  selectedChallengeDetail: {
    challengeJoinId: 0,
    challengeVideoPath: '',
    isLike: false,
    likeCnt: 0,
    nickname: '',
    score: 0,
    userId: 0,
  },
  comparePlay: false,
};

interface APIstate {
  page: number;
  size: number;
  nickname: string;
  sortBy: string;
  challengeId: number;
}

export const getChallengeDetails = createAsyncThunk(
  'challengeDetailSlice/getChallengeDetails',
  async ({ page, size, nickname, sortBy, challengeId }: APIstate) => {
    const response = await getChallengeDetailsAPI(page, size, nickname, sortBy, challengeId);
    return response;
  },
);

const challengeDetailSlice = createSlice({
  name: 'challengeDetail',
  initialState: inistalState,
  reducers: {
    setSelectedChallengeDetail: (state, action: PayloadAction<ChallengeDetails>) => {
      state.selectedChallengeDetail = action.payload;
    },
    decrementChallengeLike: (state, action: PayloadAction<number>) => {
      const challengeDetail = state.challengeDetailLists.find(
        detail => detail.challengeJoinId === action.payload,
      );
      if (challengeDetail) {
        challengeDetail.isLike = false;
        challengeDetail.likeCnt--;
      }
    },
    incrementChallengeLike: (state, action: PayloadAction<number>) => {
      const challengeDetail = state.challengeDetailLists.find(
        detail => detail.challengeJoinId === action.payload,
      );
      if (challengeDetail) {
        challengeDetail.isLike = true;
        challengeDetail.likeCnt++;
      }
    },
    initialChallengeDetailList: state => {
      state.challengeDetailLists = [];
      state.currentPage = 0;
      state.totalPage = 1;
    },
    setChallengeDetailPage: state => {
      if (state.totalPage > state.currentPage) state.currentPage = state.currentPage + 1;
    },
    deleteChallengeDetail: (state, action: PayloadAction<number>) => {
      state.challengeDetailLists = state.challengeDetailLists.filter(
        detail => detail.challengeJoinId !== action.payload,
      );
    },
    playCompareVideo: state => {
      state.comparePlay = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getChallengeDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(getChallengeDetails.fulfilled, (state, action) => {
        state.status = 'success';
        state.challengeDetailLists = action.payload.content;
      })
      .addCase(getChallengeDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedChallengeDetail,
  decrementChallengeLike,
  incrementChallengeLike,
  deleteChallengeDetail,
  initialChallengeDetailList,
  setChallengeDetailPage,
  playCompareVideo,
} = challengeDetailSlice.actions;
export default challengeDetailSlice.reducer;
