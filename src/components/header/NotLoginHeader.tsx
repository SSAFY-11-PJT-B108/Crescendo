import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as Login } from '../../assets/images/login.svg';
import { ReactComponent as UserList } from '../../assets/images/userlist.svg';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ModeState } from './LoginHeader';
import NotSearchUser from '../userlist/NotSearchUser';

export default function NotLoginHeader() {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [userMode, setUserMode] = useState<ModeState>('');
  const menuRef = useRef<HTMLUListElement>(null);
  const location = useLocation();
  const handleModeClick = (mode: ModeState) => {
    setUserMode(prevMode => (prevMode === mode ? '' : mode));
  };
  const updateIndicator = () => {
    const menuElement = menuRef.current;
    if (menuElement) {
      const activeLink = menuElement.querySelector('.active') as HTMLElement;
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setIndicatorStyle({
          left: offsetLeft + (offsetWidth - 80) / 2 + 'px', // Center the indicator
          display: 'block',
        });
      } else {
        setIndicatorStyle({ display: 'none' });
      }
    }
  };

  useEffect(() => {
    updateIndicator();
  }, [location]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, []);

  return (
    <>
      <div className="header"></div>
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="header">
          <Link to="/">
            <div className="header_title">CRESCENDO</div>
          </Link>

          <ul className="header_menu" ref={menuRef}>
            <li>
              <NavLink to="/community">커뮤니티</NavLink>
            </li>
            <li>
              <NavLink to="/dance">댄스챌린지</NavLink>
            </li>
            <li>
              <NavLink to="/favorite">전국최애자랑</NavLink>
            </li>
            <div className="indicator" style={indicatorStyle}></div>
          </ul>

          <div className="header_icon">
            <Link to="/login" onClick={() => handleModeClick('')}>
              <Login className="w-8 h-8" />
            </Link>
            <div
              className={` header_icon_div ${userMode === 'userlist' ? 'userlist' : ''}`}
              onClick={() => handleModeClick('userlist')}
            >
              <UserList className="w-8 h-8" />
            </div>
            {userMode === 'userlist' && <NotSearchUser handleMode={setUserMode} />}
          </div>
        </div>
      </div>
    </>
  );
}
