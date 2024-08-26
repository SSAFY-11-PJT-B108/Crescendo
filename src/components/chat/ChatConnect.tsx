import React, { useEffect, useRef } from 'react';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import { BASE_URL, getUserId } from '../../apis/core';
import { Message } from '../../interface/chat';
import {
  getUserChatRoomList,
  incrementUnReadChat,
  setLastChatting,
} from '../../features/chat/chatroomSlice';

const ChatConnect: React.FC = () => {
  const { setClient, setConnected, connected, client } = useWebSocket();
  const { selectedGroup } = useAppSelector(state => state.chatroom);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getUserChatRoomList());
    return () => promise.abort();
  }, [dispatch]);

  useEffect(() => {
    const stompClient: CompatClient = Stomp.over(() => new SockJS(`${BASE_URL}/ws`));
    stompClient.connect({}, (frame: string) => {
      setClient(stompClient);
      setConnected(true);
    });

    return () => {
      stompClient?.disconnect(() => {
        setConnected(false);
        setClient(null);
      });
    };
  }, [setClient, setConnected]);

  useEffect(() => {
    if (connected && client) {
      subscriptionRef.current = client.subscribe(`/topic/messages/${getUserId()}`, message => {
        if (typeof message.body === 'string') {
          try {
            const newMessage: Message = JSON.parse(message.body);
            dispatch(
              setLastChatting({
                dmGroupId: newMessage.dmGroupId,
                opponentId: newMessage.writerId,
                opponentProfilePath: newMessage.writerProfilePath,
                opponentNickName: newMessage.writerNickName,
                lastChatting: newMessage.message,
                lastChattingTime: newMessage.createdAt,
              }),
            );
            if (newMessage.dmGroupId !== selectedGroup.dmGroupId) {
              dispatch(incrementUnReadChat(newMessage.dmGroupId));
            }
          } catch (error) {
            console.error('Error parsing message body:', error);
          }
        } else {
          console.error('Message body is not a string');
        }
      });
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [selectedGroup.dmGroupId, dispatch, client, connected]);

  return null;
};

export default ChatConnect;
