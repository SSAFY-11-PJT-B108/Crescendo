import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import myFeedReducer from '../features/mypage/myFeedSlice';
import communityListReducer from '../features/communityList/communityListSlice';
import followerReducer from '../features/mypage/followerSlice';
import followingReducer from '../features/mypage/followingSlice';
import chatroomReducer from '../features/chat/chatroomSlice';
import messagesReducer from '../features/chat/messageSlice';
import favoriteReducer from '../features/favorite/favoriteSlice';
import alarmReducer from '../features/alarm/alarmSlice';
import communityDetailReducer from '../features/communityDetail/communityDetailSlice';
import commentReducer from '../features/comment/commentSlice';
import profileReducer from '../features/mypage/profileSlice';
import challengeReducer from '../features/challenge/challengeSlice';
import challengeDetailReducer from '../features/challenge/challengeDetailSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    myFeed: myFeedReducer,
    communityList: communityListReducer,
    follower: followerReducer,
    following: followingReducer,
    chatroom: chatroomReducer,
    message: messagesReducer,
    favorite: favoriteReducer,
    alarm: alarmReducer,
    communityDetail: communityDetailReducer,
    comment: commentReducer,
    profile: profileReducer,
    challenge: challengeReducer,
    challengeDetail: challengeDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
