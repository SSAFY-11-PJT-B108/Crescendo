import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as UserList } from '../../assets/images/userlist.svg';
import { ReactComponent as User } from '../../assets/images/user.svg';
import { ReactComponent as Alarm } from '../../assets/images/alarm.svg';
import { ReactComponent as Chat } from '../../assets/images/chat.svg';
import { Link, NavLink, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import ChatLayout from '../chat/ChatLayout';
import Chatroom from '../chat/ChatRoom';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import SearchUser from '../userlist/SearchUser';
import AlarmLayout from '../alarm/AlarmLayout';
import { getUnReadAlarmCount } from '../../features/alarm/alarmSlice';

export type ModeState = 'chat' | 'alarm' | 'userlist' | 'user' | '';

export default function LoginHeader() {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [userMode, setUserMode] = useState<ModeState>('');
  const menuRef = useRef<HTMLUListElement>(null);
  const location = useLocation();

  const { unReadAlarmCount } = useAppSelector(state => state.alarm);
  const { unReadChats } = useAppSelector(state => state.chatroom);
  const dispatch = useAppDispatch();
  const { isSelected } = useAppSelector(state => state.chatroom);
  const handleModeClick = (mode: ModeState) => {
    setUserMode(prevMode => (prevMode === mode ? '' : mode));
  };
  useEffect(() => {
    dispatch(getUnReadAlarmCount());
  }, [dispatch]);

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
            <div
              className={` header_icon_div count ${userMode === 'chat' ? 'chat' : ''}`}
              onClick={() => handleModeClick('chat')}
            >
              {unReadChats.length > 0 ? (
                <div className="flex absolute top-1 right-1 text-xs w-3 h-3 bg-white text-mainColor rounded-full justify-center items-center"></div>
              ) : null}
              <Chat className="header_svg" />
            </div>
            <div
              className={` header_icon_div count ${userMode === 'alarm' ? 'alarm' : ''}`}
              onClick={() => handleModeClick('alarm')}
            >
              {unReadAlarmCount > 0 ? (
                <div className="flex absolute top-1 right-1 text-xs w-3 h-3 bg-white text-mainColor rounded-full justify-center items-center"></div>
              ) : null}
              <Alarm className="header_svg" />
            </div>
            <div
              className={` header_icon_div ${userMode === 'userlist' ? 'userlist' : ''}`}
              onClick={() => handleModeClick('userlist')}
            >
              <UserList className="header_svg" />
            </div>
            <div
              className={` header_icon_div ${userMode === 'user' ? 'user' : ''}`}
              onClick={() => handleModeClick('user')}
            >
              <User className="header_svg" />
            </div>
            {userMode === 'chat' && isSelected === false && <ChatLayout />}
            {userMode === 'chat' && isSelected === true && <Chatroom />}
            {userMode === 'alarm' && <AlarmLayout />}
            {userMode === 'userlist' && <SearchUser handleMode={setUserMode} />}
            {userMode === 'user' && <UserMenu handleMode={() => setUserMode('')} />}
          </div>
        </div>
      </div>
    </>
  );
}
