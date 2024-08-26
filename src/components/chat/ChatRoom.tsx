import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as Back } from '../../assets/images/Chat/back.svg';
import { ReactComponent as Hamburger } from '../../assets/images/Chat/hamburger.svg';
import { ReactComponent as Line } from '../../assets/images/Chat/line.svg';
import { ReactComponent as Clip } from '../../assets/images/Chat/clip.svg';
import { ReactComponent as Submit } from '../../assets/images/Chat/submit.svg';
import MyMessage from './MyMessage';
import OtherMessage from './OtherMessage';
import { getUserId } from '../../apis/core';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import { setIsSelected, setSelectedGroup } from '../../features/chat/chatroomSlice';
import { getMessages, initialMessage, setMessage, setPage } from '../../features/chat/messageSlice';
import { ChatDateTransfer } from '../../utils/ChatDateTransfer';
import { Message } from '../../interface/chat';
import { useWebSocket } from '../../contexts/WebSocketContext';

export default function Chatroom() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isScroll, setScroll] = useState<boolean>(false);
  const { dmGroupId, opponentNickName, opponentId } = useAppSelector(
    state => state.chatroom.selectedGroup,
  );
  const { messageList, currentPage } = useAppSelector(state => state.message);
  const { client } = useWebSocket();
  const messageListRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const dispatch = useAppDispatch();

  const HandleMessageSend = () => {
    const message = inputRef.current!.value;

    if (message !== '') {
      client!.send(
        '/app/message',
        {},
        JSON.stringify({
          dmGroupId: dmGroupId,
          message: message,
          writerId: getUserId(),
          recipientId: opponentId,
        }),
      );
      inputRef.current!.value = '';
    }
  };
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      HandleMessageSend();
    }
  };

  useEffect(() => {
    setScroll(false);
    dispatch(getMessages({ userId: getUserId(), dmGroupId, page: currentPage, size: 10 }));
  }, [dmGroupId, currentPage, dispatch]);

  useEffect(() => {
    const subscription = client?.subscribe(`/topic/messages/${getUserId()}`, content => {
      const newMessage: Message = JSON.parse(content.body);
      setScroll(true);
      dispatch(setMessage(newMessage));
    });

    return () => {
      subscription?.unsubscribe();
      dispatch(initialMessage());
    };
  }, [dispatch, client]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        const currentScrollHeight = messageListRef.current?.scrollHeight || 0;
        setPrevScrollHeight(currentScrollHeight);
        dispatch(setPage());
      }
    },
    [dispatch],
  );

  useEffect(() => {
    //스크롤이 업데이트 된다면
    if (prevScrollHeight > 0) {
      const newScrollHeight = messageListRef.current?.scrollHeight || 0;
      if (messageListRef.current) {
        messageListRef.current.scrollTop = newScrollHeight - prevScrollHeight;
      }
    }

    if (isScroll && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messageList, prevScrollHeight, isScroll]);

  useEffect(() => {
    const option = {
      root: messageListRef.current,
      threshold: 0.1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (messageListRef.current && messageListRef.current.firstElementChild) {
      observer.observe(messageListRef.current.firstElementChild);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="chatroom">
      <div className="upper">
        <div className="back">
          <Back
            onClick={() => {
              dispatch(setIsSelected(false));
              dispatch(
                setSelectedGroup({
                  dmGroupId: -1,
                  opponentId: 0,
                  opponentProfilePath: '',
                  opponentNickName: '',
                  lastChatting: '',
                  lastChattingTime: '',
                }),
              );
            }}
          />
        </div>
        <div className="w-8/12 truncate break-all flex justify-center">{opponentNickName}</div>
        <Hamburger />
      </div>

      <div className="messagelist" ref={messageListRef}>
        <div></div>
        {messageList.map((message, index) => {
          const messageDate = new Date(message.createdAt).toLocaleDateString();
          const isNewDate =
            index === 0 ||
            messageDate !== new Date(messageList[index - 1].createdAt).toLocaleDateString();
          return (
            <div key={index}>
              {isNewDate && (
                <div className="date">
                  <Line style={{ width: 20 }} />
                  <div className="text-xs">{ChatDateTransfer(messageDate)}</div>
                  <Line />
                </div>
              )}
              {message.writerId === getUserId() ? (
                <MyMessage message={message} />
              ) : (
                <OtherMessage message={message} />
              )}
            </div>
          );
        })}
      </div>
      <div className="send-container">
        <span>
          <input
            type="text"
            className="search-input"
            placeholder="여기에 입력하세요"
            ref={inputRef}
            onKeyUp={handleKeyUp}
          />
          <div className="send-icon">
            <Clip className="w-5 h-5" />
            <Submit className="w-5 h-5" onClick={HandleMessageSend} />
          </div>
        </span>
      </div>
    </div>
  );
}
