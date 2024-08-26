import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Image1 } from '../../assets/images/main/gallery.svg';
import { ReactComponent as Image2 } from '../../assets/images/main/gallery2.svg';
const Section1 = () => {
  return (
    <>
      <div className="section1-content">
        <div className="w-1/3 section1-title">
          당신의 아이돌 덕질을
          <br />
          쉽게.
          <br />
          <span className="section1-span">
            피드, 팬아트 등 당신만의 맞춤 덕질로 다양하게 즐겨보세요.
          </span>
          <br />
          <Link className="block w-2/5" to="community">
            <button className=" w-full px-3 py-1.5 text-sm shadow-sm section1-button">
              덕질 하러가기
            </button>
          </Link>
        </div>
        <Image1 className="section1-card1 " data-aos="fade-left" data-aos-duration="1500" />
        <Image2 className="section1-card2 " data-aos="fade-right" data-aos-duration="1500" />
      </div>
    </>
  );
};
export default React.memo(Section1);
