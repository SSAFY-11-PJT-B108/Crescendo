import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login } from '../features/auth/authSlice';
import { isValidEmail } from '../utils/EmailValidation';
import { isValidPassword } from '../utils/PasswordValidation';
import { ReactComponent as Visualization } from '../assets/images/visualization.svg';
import { Link, useNavigate } from 'react-router-dom';
import '../scss/page/_login.scss';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Redux 디스패치를 사용하여 액션 전송
  const { error, loading, isLoggedIn } = useSelector((state: RootState) => state.auth); // Redux 스토어에서 인증 상태 선택
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('email') || ''); // 로컬 스토리지에서 이메일 불러오기
  const [password, setPassword] = useState(''); // 비밀번호 상태 관리
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 시각화 상태 관리
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true'); // 로컬 스토리지에서 '아이디 저장' 체크박스 상태 불러오기
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 관리

  // 컴포넌트가 처음 마운트될 때만 실행
  useEffect(() => {}, [email, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(-1); // 로그인 성공 시 이전 페이지로 이동
    }
  }, [isLoggedIn, navigate]);

  // 이메일 입력이 변경될 때 호출되는 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); // 이메일 상태를 업데이트
  };

  // 비밀번호 입력이 변경될 때 호출되는 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value); // 비밀번호 상태를 업데이트
  };

  // 로그인 폼이 제출될 때 호출되는 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출의 기본 동작 막음

    // '아이디 저장' 체크박스가 체크되어 있는 경우 이메일을 로컬 스토리지에 저장
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true'); // 'rememberMe' 상태를 로컬 스토리지에 저장
      localStorage.setItem('email', email); // 이메일을 로컬 스토리지에 저장
    } else {
      localStorage.removeItem('rememberMe'); // 'rememberMe' 상태를 로컬 스토리지에서 제거
      localStorage.removeItem('email'); // 이메일을 로컬 스토리지에서 제거
    }

    // 이메일 유효성 검사
    if (!isValidEmail(email)) {
      setErrorMessage('유효한 이메일 주소를 입력하세요.'); // 이메일이 유효하지 않을 시 에러 메시지 설정
      return;
    }

    // 비밀번호 유효성 검사
    if (!isValidPassword(password)) {
      setErrorMessage(
        '비밀번호는 최소 8자 이상, 32자 이하이며, 영어, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.', // 비밀번호가 유효하지 않으면 에러 메시지 설정
      );
      return;
    }

    setErrorMessage(''); // 에러 메시지를 초기화
    dispatch(login({ email, password })); // 로그인 액션 디스패치
  };

  return (
    <div className="login-container">
      <h1 className="login-title">로그인</h1>
      <div className="login-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="E-Mail"
              value={email}
              onChange={handleEmailChange}
              maxLength={254}
              required
            />
          </div>
          <div className="form-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              minLength={8}
              maxLength={32}
              required
            />
            <Visualization
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? '숨기기' : '보이기'} {/* 비밀번호 시각화 토글 버튼 */}
            </Visualization>
            <Link to="/password-reset" className="forgot-password">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <div className="form-actions">
            <div className="checkbox-group">
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <div className="custom-checkbox"></div>
                <label>이메일저장</label>
              </div>
            </div>
            <div className="button-group">
              <div className="signup-link">
                <Link to="/signup">
                  <button type="button">회원가입</button>
                </Link>
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                로그인
              </button>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}{' '}
        </form>
      </div>
    </div>
  );
};

export default Login;
