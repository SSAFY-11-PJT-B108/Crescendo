//Ducks 패턴 공부예정

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { user } from '../../interface/user';
import { followingAPI } from '../../apis/follow';

type PromiseStatus = 'loading' | 'success' | 'failed' | '';
interface followProps {
  followingList: user[];
  status: PromiseStatus;
  error: string | undefined;
}

//createAsyncThunk는 비동기 작업을 도와주는 액션함수이기때문에
//타입이 있어야한다.
export const getUserFollowing = createAsyncThunk(
  'followingSlice/getUserFollowing',
  async (userId: number) => {
    const response = await followingAPI(userId);
    return response;
  },
);

const inistalState: followProps = {
  followingList: [],
  status: '',
  error: '',
};

const followingSlice = createSlice({
  name: 'following',
  initialState: inistalState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserFollowing.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        state.status = 'success';
        state.followingList = action.payload.followingList;
      })
      .addCase(getUserFollowing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default followingSlice.reducer;
