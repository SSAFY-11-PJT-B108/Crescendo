import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAlarmAPI, getUnReadAlarmCountAPI } from '../../apis/alarm';
import { Alarm } from '../../interface/alarm';

export type PromiseStatus = 'loading' | 'success' | 'failed' | '';
interface AlarmProps {
  alarmList: Alarm[];
  unReadAlarmCount: number;
  status: PromiseStatus;
  error: string | undefined;
  currentPage: number;
  totalPage: number;
  size: number;
}
const inistalState: AlarmProps = {
  alarmList: [],
  unReadAlarmCount: 0,
  status: '',
  error: '',
  currentPage: 0,
  totalPage: 1,
  size: 4,
};

interface APIstate {
  page: number;
  size: number;
}
export const getAlarmList = createAsyncThunk(
  'alarmSlice/getAlarmList',
  async ({ page, size }: APIstate) => {
    const response = await getAlarmAPI(page, size);
    return response;
  },
);

export const getUnReadAlarmCount = createAsyncThunk('alarmSlice/getUnReadAlarmCount', async () => {
  const response = await getUnReadAlarmCountAPI();
  return response;
});

const alarmSlice = createSlice({
  name: 'feed',
  initialState: inistalState,
  reducers: {
    incrementUnRead: state => {
      state.unReadAlarmCount++;
    },
    decrementUnRead: state => {
      state.unReadAlarmCount--;
    },
    deleteAlarm: (state, action: PayloadAction<number>) => {
      const index = state.alarmList.findIndex(alarm => alarm.alarmId === action.payload);

      if (index !== -1) {
        state.alarmList.splice(index, 1);
      }
    },
    readAlarmUpdate: (state, action: PayloadAction<number>) => {
      state.alarmList = state.alarmList.map(alarm => {
        if (alarm.alarmId === action.payload) {
          return { ...alarm, isRead: true };
        }
        return alarm;
      });
    },
    setAlarmPage: state => {
      if (state.totalPage > state.currentPage) state.currentPage = state.currentPage + 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAlarmList.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAlarmList.fulfilled, (state, action) => {
        state.status = 'success';
        state.alarmList = [...state.alarmList, ...action.payload.content];
        state.totalPage = action.payload.totalPages;
      })
      .addCase(getAlarmList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getUnReadAlarmCount.fulfilled, (state, action) => {
        state.unReadAlarmCount = action.payload;
      });
  },
});

export const { incrementUnRead, decrementUnRead, deleteAlarm, readAlarmUpdate, setAlarmPage } =
  alarmSlice.actions;
export default alarmSlice.reducer;
