import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Message } from '../../interface/chat';
import { messagesAPI } from '../../apis/chat';
import { PromiseStatus } from '../mypage/followerSlice';

interface messageProps {
  messageList: Message[];
  status: PromiseStatus;
  currentPage: number;
  error: string | undefined;
  totalPage: number;
}
const inistalState: messageProps = {
  messageList: [],
  status: '',
  error: '',
  currentPage: 0,
  totalPage: 1,
};

interface APIState {
  userId: number;
  dmGroupId: number;
  page: number;
  size: number;
}
export const getMessages = createAsyncThunk(
  'messageSlice/getMessages',
  async ({ userId, dmGroupId, page }: APIState) => {
    const response = await messagesAPI(userId, page, 10, dmGroupId);
    return response;
  },
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: inistalState,
  reducers: {
    setMessage: (state, action: PayloadAction<Message>) => {
      state.messageList = [...state.messageList, action.payload];
    },
    initialMessage: state => {
      state.messageList = [];
      state.currentPage = 0;
      state.totalPage = 1;
    },
    setPage: state => {
      if (state.totalPage > state.currentPage) state.currentPage = state.currentPage + 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getMessages.pending, state => {
        state.status = 'loading';
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.status = 'success';
        state.messageList = [...action.payload.content.reverse(), ...state.messageList];
        state.totalPage = action.payload.totalPages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setMessage, initialMessage, setPage } = messageSlice.actions;
export default messageSlice.reducer;
