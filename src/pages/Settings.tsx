import React, { useState } from 'react';
import { isValidPassword } from '../utils/PasswordValidation';
import { ReactComponent as Visualization } from '../assets/images/visualization.svg';
import { ReactComponent as WarningSign } from '../assets/images/warning_shield.svg';
import { Authapi, getUserId } from '../apis/core';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks/hook';
import { reset } from '../features/auth/authSlice';

const Settings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const userId = getUserId();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 비밀번호
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 비밀번호 확인
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
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

    try {
      await Authapi.patch(`api/v1/user/mypage/password?loggedInUserId=${userId}`, {
        currentPassword,
        newPassword: password,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate(0);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data === '현재 비밀번호와 일치하지 않습니다.'
      ) {
        setFieldErrors(prev => ({
          ...prev,
          currentPassword: error.response.data,
        }));
      }
    }
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      '회원 탈퇴 후에는 복구가 불가능하며 작성한 모든 데이터가 삭제됩니다. 정말 삭제하시겠습니까?',
    );
    if (confirmDelete) {
      try {
        await Authapi.delete(`api/v1/user?loggedInUserId=${userId}`);
        alert('회원 탈퇴 성공');
        dispatch(reset());
        navigate('/');
      } catch (error) {
        alert('회원 탈퇴 실패');
      }
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">비밀번호 변경</h1>
      <div className="password-reset-wrapper">
        <form onSubmit={handleSubmit} className="password-reset-form">
          <div className="form-group">
            <div className="input-group">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="현재 비밀번호 입력"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                minLength={8}
                maxLength={32}
                required
              />
              <Visualization
                onClick={() => setShowCurrentPassword(prev => !prev)}
                className="toggle-password"
              >
                {showPassword ? '숨기기' : '보이기'}
              </Visualization>
            </div>
            <p className={`error-message ${fieldErrors.currentPassword ? 'visible' : ''}`}>
              {fieldErrors.currentPassword}
            </p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="새 비밀번호 입력"
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
            <button type="submit" className="submit-button">
              변경
            </button>
          </div>
        </form>
      </div>
      <h1 className="settings-title">회원 탈퇴</h1>
      <div className="flex items-center mb-5">
        <WarningSign />
        <div className="deletion-warning-msg">탈퇴 시 되돌릴 수 없습니다.</div>
      </div>
      <div className="button-group">
        <button className="delete-button" onClick={handleDeleteClick}>
          탈퇴
        </button>
      </div>
    </div>
  );
};

export default Settings;
