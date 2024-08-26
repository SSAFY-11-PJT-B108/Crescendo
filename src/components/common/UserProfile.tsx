import React, { useState } from 'react';
import { ReactComponent as UserDefault } from '../../assets/images/UserProfile/reduser.svg';
import { Link } from 'react-router-dom';

interface UserProfileProps {
  className?: string;
  userId: number;
  userNickname: string;
  userProfilePath: string | null;
  date?: string;
}

export default function UserProfile({
  className,
  userId,
  userNickname,
  userProfilePath,
  date,
}: UserProfileProps) {
  const [notFoundImgError, setNotFoundImgError] = useState<boolean>(false);
  return (
    <div className={`flex ${className}`}>
      <div className="mr-5">
        {notFoundImgError ? (
          <Link to={`/mypage/${userId}`}>
            <UserDefault onClick={() => window.scrollTo(0, 0)} />
          </Link>
        ) : (
          <Link to={`/mypage/${userId}`}>
            <img
              className="w-12 h-12 rounded-full"
              src={userProfilePath || ''}
              alt="이미지없음에러"
              onError={() => setNotFoundImgError(true)}
              onClick={() => window.scrollTo(0, 0)}
            />
          </Link>
        )}
      </div>
      <div className="flex-col">
        <div className="text-2xl">{userNickname}</div>
        {date && <div className="text-xs">{date}</div>}
      </div>
    </div>
  );
}
