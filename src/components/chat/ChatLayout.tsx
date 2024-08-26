import React from 'react';
import ChatRoomListItem from './ChatRoomListItem';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import {
  decrementUnReadChat,
  setIsSelected,
  setSelectedGroup,
} from '../../features/chat/chatroomSlice';
import { ChatRoom } from '../../interface/chat';

export default function ChatLayout() {
  const { chatRoomList } = useAppSelector(state => state.chatroom);
  const dispatch = useAppDispatch();

  const HandleClick = (Group: ChatRoom) => {
    dispatch(setSelectedGroup(Group));
    dispatch(setIsSelected(true));
    dispatch(decrementUnReadChat(Group.dmGroupId));
  };
  // useEffect(() => {
  //   const promise = dispatch(getUserChatRoomList());
  //   return () => promise.abort();
  // }, [dispatch]);

  return (
    <div className="chatlayout">
      <div className="title">채팅목록</div>

      <div className="chatroomlist">
        {chatRoomList.map((room, index) => (
          <ChatRoomListItem key={index} room={room} HandleClick={HandleClick} />
        ))}
      </div>
    </div>
  );
}
