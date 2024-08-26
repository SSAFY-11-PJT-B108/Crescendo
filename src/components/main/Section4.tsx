import React from 'react';
import { Link } from 'react-router-dom';
const Section4 = () => {
  return (
    <div className="section4-content">
      <div className="section4-title_box">
        <div className="section4-title">자, 출발해볼까요? </div>
        <div className="section4-subtitle">당신의 완벽한 덕질이 기다리고 있습니다.</div>
        <Link to="/community">
          <div className="section4-button px-3 py-1.5 text-sm font-semibold shadow-sm bg-yellow-400 hover:bg-yellow-500 ">
            덕질 하러가기
          </div>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(Section4);
