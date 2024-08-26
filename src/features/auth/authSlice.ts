import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, Authapi, setUserId, setAccessToken } from '../../apis/core';

// 인터페이스
interface AuthState {
  email: string; // 사용자 이메일 주소
  loading: boolean; // 현재 비동기 작업이 진행 중인지 여부
  error: string | null; // 비동기 작업 중 발생한 오류 메시지
  isLoggedIn: boolean; // 사용자 로그인 상태 여부
  accessToken: string | null; // 로그인 후 받은 엑세스 토큰
  emailAuthId: number | null; // 이메일 인증 ID
}

// 초기 상태 정의 (초기값)
const initialState: AuthState = {
  email: '',
  loading: false,
  error: null,
  isLoggedIn: false,
  accessToken: null,
  emailAuthId: null,
};

// 로그인 비동기 함수
// 성공 시 액세스 토큰을 설정하고 email과 accessToken 반환
// 실패 시 오류 메시지 반환
// 리프레쉬 토큰은 httponly secure 쿠키로 오기 때문에 처리 x
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      setUserId(response.data.userId);
      const accessToken = response.headers.authorization.split(' ')[1];
      setAccessToken(accessToken);
      return { email, accessToken };
    } catch (error) {
      // console.log(error);
      return rejectWithValue('로그인 실패');
    }
  },
);

// 이메일 중복 확인 비동기 함수
export const checkEmailExists = createAsyncThunk(
  'auth/checkEmailExists',
  async (email: string, { rejectWithValue }) => {
    try {
      await api.post('/api/v1/user/email/exists', { email });
    } catch (error) {
      return rejectWithValue('사용중인 이메일입니다.');
    }
  },
);

// 닉네임 중복 확인 비동기 함수
export const checkNicknameExists = createAsyncThunk(
  'auth/checkNicknameExists',
  async (nickname: string, { rejectWithValue }) => {
    try {
      await api.post('/api/v1/user/nickname/exists', { nickname });
    } catch (error) {
      return rejectWithValue('사용중인 닉네임입니다.');
    }
  },
);

// 회원가입 비동기 함수
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    data: {
      email: string;
      password: string;
      nickname: string;
      idolId: number;
      emailAuthId: number;
      randomKey: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await api.post('/api/v1/auth/sign-up', data);
    } catch (error) {
      return rejectWithValue('회원가입 실패');
    }
  },
);

// 이메일 인증번호 보내기 비동기 함수
export const sendVerificationCode = createAsyncThunk(
  'auth/sendVerificationCode',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/auth/email/random-key', { email });
      return response.data.emailAuthId;
    } catch (error) {
      return rejectWithValue('인증번호 전송 실패');
    }
  },
);

// 이메일 인증번호 확인 비동기 함수
export const verifyEmailCode = createAsyncThunk(
  'auth/verifyEmailCode',
  async (
    { emailAuthId, randomKey }: { emailAuthId: number; randomKey: string },
    { rejectWithValue },
  ) => {
    try {
      await api.post('/api/v1/auth/email/validation', { emailAuthId, randomKey });
      return { emailAuthId };
    } catch (error) {
      return rejectWithValue('유효하지 않는 인증번호입니다.');
    }
  },
);

// 비밀번호 재설정 비동기 함수
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    {
      email,
      newPassword,
      emailAuthId,
      randomKey,
    }: { email: string; newPassword: string; emailAuthId: number; randomKey: string },
    { rejectWithValue },
  ) => {
    try {
      await api.patch('/api/v1/auth/password', { email, newPassword, emailAuthId, randomKey });
    } catch (error) {
      return rejectWithValue('비밀번호 변경 실패');
    }
  },
);

// 로그아웃 비동기 함수
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await Authapi.post('/api/v1/auth/logout', {}); // refresh token 만료 요청
    setAccessToken(null); // 엑세스 토큰 삭제
    setUserId(-1);
    localStorage.removeItem('autoLogin');
    localStorage.removeItem('password');
  } catch (error) {
    return rejectWithValue('로그아웃 실패');
  }
});

// 자동 로그인, 로그인 연장
// 리프레쉬 토큰으로 엑세스 토큰 재발급 요청
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/auth/refresh-token', {}, { withCredentials: true });
      setUserId(response.data.userId);
      const newAccessToken = response.headers.authorization.split(' ')[1];
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      return rejectWithValue('');
    }
  },
);

// 슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // reset : 초기 상태로 재설정
    reset(state) {
      state.email = '';
      state.loading = false;
      state.error = null;
      state.isLoggedIn = false;
      state.accessToken = null;
      state.emailAuthId = null;
    },
    // logout : 로그아웃, 액세스 토큰 제거
    logout(state) {
      state.email = '';
      state.loading = false;
      state.error = null;
      state.isLoggedIn = false;
      state.accessToken = null;
      state.emailAuthId = null;
      setAccessToken(null); // 엑세스 토큰 삭제
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      state.isLoggedIn = !!action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ email: string; accessToken: string }>) => {
          state.loading = false;
          state.isLoggedIn = true;
          state.email = action.payload.email;
          state.accessToken = action.payload.accessToken;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkEmailExists.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkEmailExists.fulfilled, state => {
        state.loading = false;
      })
      .addCase(checkEmailExists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkNicknameExists.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkNicknameExists.fulfilled, state => {
        state.loading = false;
      })
      .addCase(checkNicknameExists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signUp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, state => {
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendVerificationCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerificationCode.fulfilled, (state, action) => {
        state.loading = false;
        state.emailAuthId = action.payload;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyEmailCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailCode.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = false;
        state.isLoggedIn = false;
        state.email = '';
        state.accessToken = null;
        state.emailAuthId = null;
        setAccessToken(null);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.accessToken = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
      })
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
