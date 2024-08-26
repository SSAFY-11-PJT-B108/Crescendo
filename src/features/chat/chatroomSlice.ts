//Ducks 패턴 공부예정

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ChatRoom } from '../../interface/chat';
import { chatroomlistAPI } from '../../apis/chat';
import { PromiseStatus } from '../mypage/followerSlice';

export interface unReadChat {
  dmGroupId: number;
}

interface chatProps {
  chatRoomList: ChatRoom[];
  status: PromiseStatus;
  error: string | undefined;
  isSelected: boolean;
  selectedGroup: ChatRoom;
  writerId: number;
  unReadChats: unReadChat[];
  isScroll: boolean;
  isChatRoom: boolean;
}
const inistalState: chatProps = {
  chatRoomList: [],
  status: '',
  error: '',
  isSelected: false,
  selectedGroup: {
    dmGroupId: -11,
    opponentId: 0,
    opponentProfilePath: '',
    opponentNickName: '',
    lastChatting: '',
    lastChattingTime: '',
  },
  writerId: 0,
  unReadChats: [],
  isScroll: false,
  isChatRoom: false,
};

export const getUserChatRoomList = createAsyncThunk(
  'chatroomSlice/getUserChatRoomList',
  async () => {
    const response = await chatroomlistAPI();
    return response;
  },
);

const chatroomSlice = createSlice({
  name: 'chat',
  initialState: inistalState,
  reducers: {
    setIsSelected: (state, action: PayloadAction<boolean>) => {
      state.isSelected = action.payload;
    },
    setSelectedGroup: (state, action: PayloadAction<ChatRoom>) => {
      state.selectedGroup = action.payload;
    },
    setLastChatting: (state, action: PayloadAction<ChatRoom>) => {
      const index = state.chatRoomList.findIndex(
        chatRoom => chatRoom.dmGroupId === action.payload.dmGroupId,
      );

      if (index !== -1) {
        state.chatRoomList[index] = action.payload;
        state.chatRoomList = [...state.chatRoomList];
        state.chatRoomList = state.chatRoomList.sort(
          (a, b) => new Date(b.lastChattingTime).getTime() - new Date(a.lastChattingTime).getTime(),
        );
      }
    },
    incrementUnReadChat: (state, action: PayloadAction<number>) => {
      const index = state.unReadChats.findIndex(
        unReadChat => unReadChat.dmGroupId === action.payload,
      );
      //새로운 그룹에 대한 채팅
      if (index === -1) {
        state.unReadChats = [...state.unReadChats, { dmGroupId: action.payload }];
      }
    },

    decrementUnReadChat: (state, action: PayloadAction<number>) => {
      state.unReadChats = state.unReadChats.filter(
        unReadChat => unReadChat.dmGroupId !== action.payload,
      );
    },
    setScroll: (state, action: PayloadAction<boolean>) => {
      state.isScroll = action.payload;
    },
    setChatRoom: (state, action: PayloadAction<boolean>) => {
      state.isChatRoom = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserChatRoomList.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserChatRoomList.fulfilled, (state, action) => {
        state.status = 'success';
        state.chatRoomList = action.payload;
      })
      .addCase(getUserChatRoomList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setIsSelected,
  setSelectedGroup,
  setLastChatting,
  incrementUnReadChat,
  decrementUnReadChat,
  setScroll,
  setChatRoom,
} = chatroomSlice.actions;
export default chatroomSlice.reducer;
