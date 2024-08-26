//Ducks 패턴 공부예정

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FeedInfo, MyFeedInfo } from '../../interface/feed';
import { getMyFanArtAPI, getMyFeedAPI, getMyGoodsAPI } from '../../apis/user';
import { FanArtInfo, GoodsInfo, MyFanArtInfo, MyGoodsInfo } from '../../interface/gallery';
import { RootState } from '../../store/store';

export type PromiseStatus = 'loading' | 'success' | 'failed' | '';

interface MyFeedState {
  myFeedList: MyFeedInfo[];
  myFanArtList: MyFanArtInfo[];
  myGoodsList: MyGoodsInfo[];
  status: PromiseStatus;
  error: string | undefined;
  hasMore: boolean;
  page: number;
}
const initialState: MyFeedState = {
  myFeedList: [],
  myFanArtList: [],
  myGoodsList: [],
  status: '',
  error: '',
  hasMore: true,
  page: 0,
};

export const getMyFeedList = createAsyncThunk(
  'myFeedSlice/getMyFeedList',
  async (userId: number, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const response = await getMyFeedAPI(userId, rootState.myFeed.page, 3);
    return response;
  },
);

export const getMyFanArtList = createAsyncThunk(
  'myFeedSlice/getMyFanArtList',
  async (userId: number, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const response = await getMyFanArtAPI(userId, rootState.myFeed.page, 3);
    return response;
  },
);

export const getMyGoodsList = createAsyncThunk(
  'myFeedSlice/getMyGoodsList',
  async (userId: number, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const response = await getMyGoodsAPI(userId, rootState.myFeed.page, 3);
    return response;
  },
);

const myFeedSlice = createSlice({
  name: 'feed',
  initialState: initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },

    incrementLike: (
      state,
      action: PayloadAction<{ type: 'feed' | 'fanArt' | 'goods'; id: number }>,
    ) => {
      if (action.payload.type === 'feed') {
        const feed = state.myFeedList.find(feed => feed.feedId === action.payload.id);
        if (feed) {
          feed.likeCnt += 1;
          feed.isLike = true;
        }
      } else if (action.payload.type === 'fanArt') {
        const fanArt = state.myFanArtList.find(fanArt => fanArt.fanArtId === action.payload.id);
        if (fanArt) {
          fanArt.likeCnt += 1;
          fanArt.isLike = true;
        }
      } else if (action.payload.type === 'goods') {
        const goods = state.myGoodsList.find(goods => goods.goodsId === action.payload.id);
        if (goods) {
          goods.likeCnt += 1;
          goods.isLike = true;
        }
      }
    },
    decrementLike: (
      state,
      action: PayloadAction<{ type: 'feed' | 'fanArt' | 'goods'; id: number }>,
    ) => {
      if (action.payload.type === 'feed') {
        const feed = state.myFeedList.find(feed => feed.feedId === action.payload.id);
        if (feed) {
          feed.likeCnt -= 1;
          feed.isLike = false;
        }
      } else if (action.payload.type === 'fanArt') {
        const fanArt = state.myFanArtList.find(fanArt => fanArt.fanArtId === action.payload.id);
        if (fanArt) {
          fanArt.likeCnt -= 1;
          fanArt.isLike = false;
        }
      } else if (action.payload.type === 'goods') {
        const goods = state.myGoodsList.find(goods => goods.goodsId === action.payload.id);
        if (goods) {
          goods.likeCnt -= 1;
          goods.isLike = false;
        }
      }
    },

    updateMyFeed: (state, action: PayloadAction<{ feed: FeedInfo; feedId: number }>) => {
      state.myFeedList = state.myFeedList.map(feed => {
        if (feed.feedId !== action.payload.feedId) {
          return feed;
        }
        const newFeed: MyFeedInfo = {
          ...action.payload.feed,
          idolGroupId: feed.idolGroupId,
          idolGroupName: feed.idolGroupName,
        };
        return newFeed;
      });
    },

    updateMyFanArt: (state, action: PayloadAction<{ fanArt: FanArtInfo; fanArtId: number }>) => {
      state.myFanArtList = state.myFanArtList.map(fanArt => {
        if (fanArt.fanArtId !== action.payload.fanArtId) {
          return fanArt;
        }
        const newFanArt: MyFanArtInfo = {
          ...action.payload.fanArt,
          idolGroupId: fanArt.idolGroupId,
          idolGroupName: fanArt.idolGroupName,
        };
        return newFanArt;
      });
    },

    updateMyGoods: (state, action: PayloadAction<{ goods: GoodsInfo; goodsId: number }>) => {
      state.myGoodsList = state.myGoodsList.map(goods => {
        if (goods.goodsId !== action.payload.goodsId) {
          return goods;
        }
        const newGoods: MyGoodsInfo = {
          ...action.payload.goods,
          idolGroupId: goods.idolGroupId,
          idolGroupName: goods.idolGroupName,
        };
        return newGoods;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getMyFeedList.pending, state => {
        state.status = 'loading';
      })
      .addCase(getMyFeedList.fulfilled, (state, action) => {
        state.status = 'success';
        state.myFeedList = [...state.myFeedList, ...action.payload.content];
        state.page += 1;
        state.hasMore = !action.payload.last;
      })
      .addCase(getMyFeedList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getMyFanArtList.pending, state => {
        state.status = 'loading';
      })
      .addCase(getMyFanArtList.fulfilled, (state, action) => {
        state.status = 'success';
        state.myFanArtList = [...state.myFanArtList, ...action.payload.content];
        state.page += 1;
        state.hasMore = !action.payload.last;
      })
      .addCase(getMyFanArtList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getMyGoodsList.pending, state => {
        state.status = 'loading';
      })
      .addCase(getMyGoodsList.fulfilled, (state, action) => {
        state.status = 'success';
        state.myGoodsList = [...state.myGoodsList, ...action.payload.content];
        state.page += 1;
        state.hasMore = !action.payload.last;
      })
      .addCase(getMyGoodsList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  resetState,
  incrementLike,
  decrementLike,
  updateMyFeed,
  updateMyFanArt,
  updateMyGoods,
} = myFeedSlice.actions;
export default myFeedSlice.reducer;
