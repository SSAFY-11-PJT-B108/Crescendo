//Ducks 패턴 공부예정

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../../interface/user';
import { getUserInfoAPI } from '../../apis/user';

type PromiseStatus = 'loading' | 'success' | 'failed' | '';
interface UserInfoProps {
  userInfo: UserInfo;
  status: PromiseStatus;
  error: string | undefined;
}

interface APIstate {
  pathId: number;
  userId: number;
}
export const getUserInfo = createAsyncThunk(
  'profileSlice/getUserInfo',
  async ({ pathId, userId }: APIstate) => {
    const response = await getUserInfoAPI(pathId, userId);
    return response;
  },
);

const inistalState: UserInfoProps = {
  userInfo: {
    profilePath: '',
    nickname: '',
    introduction: '',
    followingNum: 0,
    followerNum: 0,
    isFollowing: false,
    favoriteImagePath: '',
  },
  status: '',
  error: '',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState: inistalState,
  reducers: {
    handleFollow: state => {
      if (state.userInfo.isFollowing === false) {
        state.userInfo.followerNum++;
      } else state.userInfo.followerNum--;
      state.userInfo.isFollowing = !state.userInfo.isFollowing;
    },
    handleInfoUpdate: (
      state,
      action: PayloadAction<{ nickname: string; introduction: string }>,
    ) => {
      const { nickname, introduction } = action.payload;
      state.userInfo = {
        ...state.userInfo,
        nickname,
        introduction,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserInfo.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserInfo.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.status = 'success';
        if (action.payload.introduction === null) action.payload.introduction = '';
        state.userInfo = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export const { handleFollow, handleInfoUpdate } = profileSlice.actions;
export default profileSlice.reducer;
