import React from 'react';
import { ChatRoom } from '../../interface/chat';
import { timeAgo } from '../../utils/TimeAgo';
import { ReactComponent as User } from '../../assets/images/Chat/user.svg';
import { IMAGE_BASE_URL } from '../../apis/core';
import { useAppSelector } from '../../store/hooks/hook';
import { UnReadChatCheck } from '../../utils/UnReadChatCheck';

interface ChatRoomItemProps {
  room: ChatRoom;
  HandleClick: (Group: ChatRoom) => void;
}

export default function ChatRoomListItem({ room, HandleClick }: ChatRoomItemProps) {
  const { unReadChats } = useAppSelector(state => state.chatroom);
  const { opponentProfilePath, opponentNickName, lastChattingTime, lastChatting, dmGroupId } = room;

  return (
    <div className="chatroomlistitem" onClick={() => HandleClick(room)}>
      {opponentProfilePath ? (
        <div className="relative m-1.5 h-10 w-10">
          {UnReadChatCheck(unReadChats, dmGroupId) === true ? (
            <div className="chatcount flex absolute  text-xs w-2 h-2 bg-white text-mainColor rounded-full justify-center items-center"></div>
          ) : null}
          <img
            src={`${IMAGE_BASE_URL}${opponentProfilePath}`}
            alt="프로필"
            className="w-full h-full rounded-full"
          />
        </div>
      ) : (
        <div className="m-1.5 h-10 w-10 relative">
          {UnReadChatCheck(unReadChats, dmGroupId) === true ? (
            <div className="chatcount flex absolute  text-xs w-2 h-2 bg-white text-mainColor rounded-full justify-center items-center"></div>
          ) : null}
          <User className="w-full h-full" />
        </div>
      )}
      <div className="content w-1/2">
        <div className="nickname">{opponentNickName}</div>
        <div className="lastchat">{lastChatting}</div>
      </div>

      <div className="lastchattime">{timeAgo(lastChattingTime)}</div>
    </div>
  );
}
