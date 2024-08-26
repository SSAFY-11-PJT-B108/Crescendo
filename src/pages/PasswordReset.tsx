import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { sendVerificationCode, verifyEmailCode, resetPassword } from '../features/auth/authSlice';
import { isValidEmail } from '../utils/EmailValidation';
import { isValidPassword } from '../utils/PasswordValidation';
import { ReactComponent as Visualization } from '../assets/images/visualization.svg';
import '../scss/page/_passwordreset.scss';

const PasswordReset: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, emailAuthId } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
  });

  const [isVerificationButtonDisabled, setIsVerificationButtonDisabled] = useState(false);
  const [verificationCountdown, setVerificationCountdown] = useState(0);
  const [isFirstVerification, setIsFirstVerification] = useState(true);
  const [isEmailLocked, setIsEmailLocked] = useState(false);
  const [isVerificationCodeLocked, setIsVerificationCodeLocked] = useState(false);
  const [verificationCodeValidity, setVerificationCodeValidity] = useState(0);

  // 타이머 관리 (인증번호 전송 후 카운트다운)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (verificationCountdown > 0 && !codeVerified) {
      timer = setInterval(() => {
        setVerificationCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setIsVerificationButtonDisabled(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [verificationCountdown, codeVerified]);

  // 인증번호 유효시간 타이머
  useEffect(() => {
    let validityTimer: ReturnType<typeof setInterval>;
    if (verificationCodeValidity > 0 && !codeVerified) {
      validityTimer = setInterval(() => {
        setVerificationCodeValidity(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (validityTimer) clearInterval(validityTimer);
    };
  }, [verificationCodeValidity, codeVerified]);

  // 이메일
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEmailLocked) {
      setEmail(e.target.value);
    }
  };

  // 인증번호 변경
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!isVerificationCodeLocked) {
      setVerificationCode(value);
    }
  };

  // 비밀번호
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 비밀번호 확인
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  // 인증번호 전송
  const handleSendVerificationCode = async () => {
    if (!isValidEmail(email)) {
      setFieldErrors(prev => ({ ...prev, email: '유효한 이메일 형식을 입력해 주세요' }));
      return;
    }

    dispatch(sendVerificationCode(email));
    setFieldErrors(prev => ({ ...prev, verificationCode: '인증번호가 전송되었습니다.' }));
    setIsVerificationButtonDisabled(true);
    setVerificationCountdown(15); // 60초
    setVerificationCodeValidity(300); // 5분
    setIsFirstVerification(false);
    setIsEmailLocked(true);
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!emailAuthId) {
      setFieldErrors(prev => ({ ...prev, verificationCode: '인증번호 전송을 먼저 해주세요.' }));
      return;
    }

    const result = await dispatch(verifyEmailCode({ emailAuthId, randomKey: verificationCode }));
    if (result.type === `${verifyEmailCode.fulfilled}`) {
      setCodeVerified(true);
      setFieldErrors(prev => ({ ...prev, verificationCode: '인증이 완료되었습니다.' }));
      setIsVerificationCodeLocked(true);
      setVerificationCountdown(0);
      setVerificationCodeValidity(0);
    } else {
      setFieldErrors(prev => ({ ...prev, verificationCode: '인증번호가 틀립니다.' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      setFieldErrors(prev => ({
        ...prev,
        password:
          '비밀번호는 최소 8자 이상, 32자 이하이며, 영어, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
      }));
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      return;
    }

    const resultAction = await dispatch(
      resetPassword({
        email,
        newPassword: password,
        emailAuthId: emailAuthId!,
        randomKey: verificationCode,
      }),
    );

    if (resetPassword.fulfilled.match(resultAction)) {
      alert('비밀번호를 변경하였습니다.');
      window.location.href = '/login';
    } else if (resetPassword.rejected.match(resultAction)) {
      alert('비밀번호 변경 실패: ' + resultAction.payload);
    }
  };

  return (
    <div className="password-reset-container">
      <h1 className="password-reset-title">비밀번호 변경</h1>
      <div className="password-reset-wrapper">
        <form onSubmit={handleSubmit} className="password-reset-form">
          <div className="form-group">
            <div className="input-group">
              <input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={isEmailLocked}
              />
              {isVerificationButtonDisabled ? (
                <span className="verification-timer">{verificationCountdown}초</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="verification-button"
                  style={{ visibility: codeVerified ? 'hidden' : 'visible' }}
                >
                  {isFirstVerification ? '인증번호 전송' : '재전송'}
                </button>
              )}
            </div>
            <p className={`error-message ${fieldErrors.email ? 'visible' : ''}`}>
              {fieldErrors.email}
            </p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                required
                maxLength={6}
                disabled={isVerificationCodeLocked}
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="verification-button"
                style={{ visibility: codeVerified ? 'hidden' : 'visible' }}
              >
                인증하기
              </button>
            </div>
            <p className={`error-message ${fieldErrors.verificationCode ? 'visible' : ''}`}>
              {fieldErrors.verificationCode}
            </p>
            <p
              className={`verification-message ${
                (!isVerificationButtonDisabled && verificationCodeValidity === 0) || codeVerified
                  ? 'hidden'
                  : ''
              }`}
            >
              {verificationCodeValidity > 0
                ? `인증 번호는 ${verificationCodeValidity}초간 유효합니다.`
                : '인증번호를 다시 전송해 주세요.'}
            </p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호 입력"
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
                {showPassword ? '숨기기' : '보이기'}
              </Visualization>
            </div>
            <p className={`error-message ${fieldErrors.password ? 'visible' : ''}`}>
              {fieldErrors.password}
            </p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                minLength={8}
                maxLength={32}
                required
              />
              <Visualization
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password"
              >
                {showConfirmPassword ? '숨기기' : '보이기'}
              </Visualization>
            </div>
            <p className={`error-message ${fieldErrors.confirmPassword ? 'visible' : ''}`}>
              {fieldErrors.confirmPassword}
            </p>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button" disabled={loading || !codeVerified}>
              변경하기
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
