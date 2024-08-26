import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Challenge } from '../../interface/challenge';
import { getChallengeAPI } from '../../apis/challenge';

export type PromiseStatus = 'loading' | 'success' | 'failed' | '';
interface ChallengeProps {
  challengeLists: Challenge[];
  status: PromiseStatus;
  error: string | undefined;
  currentPage: number;
  totalPage: number;
  size: number;
  selectedChallenge: Challenge;
}
const inistalState: ChallengeProps = {
  challengeLists: [],
  status: '',
  error: '',
  currentPage: 0,
  totalPage: 1,
  size: 4,
  selectedChallenge: {
    challengeId: 0,
    title: '',
    challengeVideoPath: '',
    createdAt: '',
    endAt: '',
    userId: 0,
    nickname: '',
    profilePath: '',
    participants: 0,
  },
};

interface APIstate {
  page: number;
  size: number;
  title: string;
  sortBy: string;
}
export const getChallengeList = createAsyncThunk(
  'challengeSlice/getChallengeList',
  async ({ page, size, title, sortBy }: APIstate) => {
    const response = await getChallengeAPI(page, size, title, sortBy);
    return response;
  },
);

const challengeSlice = createSlice({
  name: 'challenge',
  initialState: inistalState,
  reducers: {
    setSelectedChallenge: (state, action: PayloadAction<Challenge>) => {
      state.selectedChallenge = action.payload;
    },
    initialChallengeList: state => {
      state.challengeLists = [];
      state.currentPage = 0;
      state.totalPage = 1;
    },
    setChallengePage: state => {
      if (state.totalPage > state.currentPage) state.currentPage = state.currentPage + 1;
    },
    deleteChallenge: (state, action: PayloadAction<number>) => {
      const index = state.challengeLists.findIndex(detail => detail.challengeId === action.payload);
      if (index !== -1) {
        state.challengeLists.splice(index, 1);
      }
    },
    incrementParticipants: (state, action: PayloadAction<number>) => {
      const index = state.challengeLists.findIndex(item => item.challengeId === action.payload);
      if (index !== -1) {
        state.challengeLists[index].participants++;
      }
    },
    decrementParticipants: (state, action: PayloadAction<number>) => {
      const index = state.challengeLists.findIndex(item => item.challengeId === action.payload);
      if (index !== -1) {
        state.challengeLists[index].participants--;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getChallengeList.pending, state => {
        state.status = 'loading';
      })
      .addCase(getChallengeList.fulfilled, (state, action) => {
        state.status = 'success';
        state.challengeLists = [...state.challengeLists, ...action.payload.content];
        state.totalPage = action.payload.totalPages;
      })
      .addCase(getChallengeList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedChallenge,
  setChallengePage,
  initialChallengeList,
  deleteChallenge,
  incrementParticipants,
  decrementParticipants,
} = challengeSlice.actions;
export default challengeSlice.reducer;
