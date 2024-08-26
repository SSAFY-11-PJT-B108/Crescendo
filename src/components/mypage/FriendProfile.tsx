import React from 'react';
import { user } from '../../interface/user';
import { IMAGE_BASE_URL } from '../../apis/core';
import { Link } from 'react-router-dom';

interface UserProps {
  user: user;
}

export default function FriendProfile({ user }: UserProps) {
  const { nickname, userProfilePath, userId } = user;

  return (
    <div className="friendprofile">
      <Link to={`/mypage/${userId}`}>
        <img src={`${IMAGE_BASE_URL}${userProfilePath}`} alt="유저 프로필" />
      </Link>
      <div className="friendprofile_nickname break-all">{nickname}</div>
    </div>
  );
}
