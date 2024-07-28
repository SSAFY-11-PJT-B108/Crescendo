import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as Login } from '../../assets/images/login.svg';
import { ReactComponent as UserList } from '../../assets/images/userlist.svg';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLUListElement>(null);
  const location = useLocation();

  useEffect(() => {
    const menuElement = menuRef.current;
    if (menuElement) {
      const activeLink = menuElement.querySelector('.active') as HTMLElement;
      if (activeLink) {
       
        const { offsetLeft, offsetWidth } = activeLink;
         console.log(offsetLeft + " " + offsetWidth);
        setIndicatorStyle({
          left: offsetLeft + (offsetWidth - 80) / 2 + 'px', // Center the indicator
        });
      }
    }
  }, [location]);

  return (
    <div className="header">
      <Link to="/">
        <div className="header_title">CRESCENDO</div>
      </Link>

      <ul className="header_menu" ref={menuRef}>
        <li>
          <NavLink to="/" >커뮤니티</NavLink>
        </li>
        <li>
          <NavLink to="/dance" >댄스챌린지</NavLink>
        </li>
        <li>
          <NavLink to="/favorite" >전국최애자랑</NavLink>
        </li>
        <li>
          <NavLink to="/game" >오락실</NavLink>
        </li>
        <div className="indicator" style={indicatorStyle}></div>
      </ul>

      <div className="header_icon">
        <NavLink to="/">
          <Login />
        </NavLink>
        <NavLink to="/">
          <UserList />
        </NavLink>
      </div>
    </div>
  );
}
