//Ducks 패턴 공부예정

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { user } from '../../interface/user';
import { followerAPI } from '../../apis/follow';

export type PromiseStatus = 'loading' | 'success' | 'failed' | '';

interface followProps {
  followerList: user[];
  status: PromiseStatus;
  error: string | undefined;
}

//createAsyncThunk는 비동기 작업을 도와주는 액션함수이기때문에
//타입이 있어야한다.
export const getUserFollower = createAsyncThunk(
  'followerSlice/getUserFollower',
  async (userId: number) => {
    const response = await followerAPI(userId);
    return response;
  },
);

const inistalState: followProps = {
  followerList: [],
  status: '',
  error: '',
};

const followerSlice = createSlice({
  name: 'follower',
  initialState: inistalState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserFollower.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserFollower.fulfilled, (state, action) => {
        state.status = 'success';
        state.followerList = action.payload.followerList;
      })
      .addCase(getUserFollower.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default followerSlice.reducer;
