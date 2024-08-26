import React from 'react';
import { ReactComponent as Image1 } from '../../assets/images/main/section3-1.svg';
import { ReactComponent as Image2 } from '../../assets/images/main/section3-2.svg';
const Section3 = () => {
  return (
    <div className="section3-content">
      <div className="section3-title_box" data-aos="fade-down" data-aos-duration="1500">
        <div className="section3-title">오늘은 내가 아이돌!</div>
        <div className="section3-subtitle">아이돌 커버 댄스를 올리고 점수를 자랑하세요!</div>
      </div>
      <div className="section3-img1" data-aos="flip-right" data-aos-duration="1500">
        <Image1 />
      </div>
      <div className="section3-img2" data-aos="flip-left" data-aos-duration="1500">
        <Image2 />
      </div>
    </div>
  );
};
export default React.memo(Section3);
