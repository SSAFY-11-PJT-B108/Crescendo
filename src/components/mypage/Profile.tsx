import React, { ChangeEvent, useRef, useState } from 'react';
import { getUserId, IMAGE_BASE_URL } from '../../apis/core';
import { modifyIntroductionAPI, modifyNicknameAPI, modifyProfileAPI } from '../../apis/user';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import { handleFollow, handleInfoUpdate } from '../../features/mypage/profileSlice';
import { followAPI } from '../../apis/follow';
import {
  isExactForbiddenNickname,
  isIncludedForbiddenNickname,
  isValidNickname,
} from '../../utils/NicknameValidation';

interface ProfileProps {
  userId: number;
}

export default function Profile({ userId }: ProfileProps) {
  const dispatch = useAppDispatch();
  const { nickname, introduction, profilePath, isFollowing } = useAppSelector(
    state => state.profile.userInfo,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const nickeRef = useRef<HTMLInputElement>(null);
  const introRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFollowClick = async () => {
    dispatch(handleFollow());
    await followAPI(userId);
  };
  const handleSaveClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);
      await modifyProfileAPI(formData);
    }
    const newNickname = nickeRef.current?.value || nickname;
    const newIntroduction = introRef.current?.value || introduction;
    if (isExactForbiddenNickname(newNickname)) {
      setNicknameError('사용할 수 없는 닉네임입니다.');
      return;
    } else if (isIncludedForbiddenNickname(newNickname)) {
      setNicknameError('욕설이 포함된 닉네임은 사용할 수 없습니다.');
      return;
    } else if (!isValidNickname(newNickname)) {
      setNicknameError('닉네임은 영어, 숫자 또는 한글로 구성된 3~10글자여야 합니다.');
      return;
    }
    setNicknameError(null);

    if (introduction !== newIntroduction) await modifyIntroductionAPI(getUserId(), newIntroduction);
    if (newNickname !== nickname) await modifyNicknameAPI(getUserId(), newNickname);
    dispatch(handleInfoUpdate({ nickname: newNickname, introduction: newIntroduction }));
    setIsEditing(prev => !prev);
  };
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result) {
          if (imageRef.current) {
            imageRef.current.src = reader.result as string; // Update image preview
          }
        }
      };
    }
  };
  return (
    <>
      <div className="profile">
        <div className="img">
          {isEditing ? (
            <>
              <img alt="유저 프로필" src={`${IMAGE_BASE_URL}${profilePath}`} ref={imageRef} />
              <label htmlFor="profile" className="editimg">
                업로드
              </label>
              <input id="profile" className="hidden" type="file" onChange={handleImageUpload} />
            </>
          ) : (
            <img src={`${IMAGE_BASE_URL}${profilePath}`} alt="유저 프로필" ref={imageRef} />
          )}
        </div>

        {isEditing ? (
          <>
            <div>닉네임</div>
            <input
              type="text"
              className="nickname_edit"
              defaultValue={nickname}
              ref={nickeRef}
              maxLength={10}
            />
            {nicknameError && <div style={{ color: 'red' }}>{nicknameError}</div>}
          </>
        ) : (
          <div className="nickname break-all">{nickname}</div>
        )}

        {isEditing ? (
          <>
            <div>소개</div>
            <textarea className="content content_edit" defaultValue={introduction} ref={introRef} />
          </>
        ) : (
          <div className="content break-all">{introduction}</div>
        )}
      </div>
      {userId === getUserId() ? (
        <>
          {isEditing ? (
            <div className="profile_save">
              <button className="w-1/4 bg-mainColor" onClick={handleSaveClick}>
                저장
              </button>
              <button
                className="w-1/4 bg-subColor"
                onClick={() => {
                  setNicknameError(null);
                  setIsEditing(prev => !prev);
                }}
              >
                취소
              </button>
            </div>
          ) : (
            <div className="profile_edit" onClick={() => setIsEditing(prev => !prev)}>
              <button>프로필 수정</button>
            </div>
          )}
        </>
      ) : (
        <>
          {isFollowing ? (
            <div className="profile_edit" onClick={handleFollowClick}>
              <button type="button">Unfollow</button>
            </div>
          ) : (
            <div className="profile_edit" onClick={handleFollowClick}>
              <button type="button">Follow</button>
            </div>
          )}
        </>
      )}
    </>
  );
}
