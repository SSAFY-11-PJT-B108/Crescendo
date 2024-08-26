import React from 'react';
import { ReactComponent as Search } from '../../assets/images/search.svg';

export default function CommunitySearchInput() {
  return (
    <div className="search-container">
      <span>
        <input className="community-search" type="text" placeholder="커뮤니티를 검색하세요" />
        <div className="search-icon">
          <Search />
        </div>
      </span>
    </div>
  );
}
