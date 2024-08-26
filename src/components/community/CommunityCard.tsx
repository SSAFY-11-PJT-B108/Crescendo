import React from 'react';
import { CommunityInfo } from '../../interface/communityList';
import { Link } from 'react-router-dom';

export default function CommunityCard({ idolGroupId, name, profile }: CommunityInfo) {
  return (
    <Link to={`${idolGroupId}`}>
      <div className="communitycard">
        <img className="communitycard_img" src={profile} alt={name}></img>
        <div className="communitycard_name">{name}</div>
      </div>
    </Link>
  );
}
