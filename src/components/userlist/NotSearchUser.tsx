import React, { useEffect, useMemo, useState } from 'react';
import SearchInput from '../common/SearchInput';
import FriendProfile from '../mypage/FriendProfile';
import { UserSearchApi } from '../../apis/user';
import DeBounce from './Debounce';
import { user } from '../../interface/user';
import { useAppDispatch } from '../../store/hooks/hook';
import { setIsSelected, setSelectedGroup } from '../../features/chat/chatroomSlice';
import { ModeState } from '../header/LoginHeader';
import { createChatroom, getOpponent } from '../../apis/chat';
import { AxiosError } from 'axios';
import { followAPI } from '../../apis/follow';
import { getUserId } from '../../apis/core';

interface SearchProps {
  handleMode: (mode: ModeState) => void;
}

export default function NotSearchUser({ handleMode }: SearchProps) {
  const [lists, setList] = useState<user[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSearch, setSearch] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const getUserList = async (nickname: string) => {
    try {
      const response = await UserSearchApi(0, 10, nickname);
      const templist = response.content.filter((list: user) => list.userId !== getUserId());
      if (templist > 0) {
        setSearch(true);
      } else {
        setSearch(false);
      }
      setList(() => [...response.content]);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };
  useEffect(() => {
    getUserList('');
  }, []);

  const OnchangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debounceHandler(e.target.value);
  };
  const debounceHandler = useMemo(() => DeBounce(input => getUserList(input), 500), []);
  const handleChatClick = async (list: user, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    let dmGroupId = 0;

    try {
      const response = await getOpponent(list.userId);
      dmGroupId = response.data.dmGroupId;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          try {
            const response = await createChatroom(list.userId);
            dmGroupId = response.data.dmGroupId;
          } catch (createError) {
            console.error('Error creating chatroom:', createError);
            return;
          }
        } else {
          console.error('Error getting opponent:', error);
          return;
        }
      } else {
        console.error('Unknown error:', error);
      }
    }

    handleMode('chat');
    dispatch(setIsSelected(true));
    dispatch(
      setSelectedGroup({
        dmGroupId: dmGroupId,
        opponentId: list.userId,
        opponentNickName: list.nickname,
        opponentProfilePath: list.userProfilePath,
        lastChatting: '',
        lastChattingTime: '',
      }),
    );
  };

  const HandleFollowClick = async (userId: number) => {
    try {
      await followAPI(userId);
      alert('팔로우가 되었습니다');
    } catch (err: unknown) {
      // console.log(err);
    }
  };

  return (
    <div className="notloginsearchuser">
      <SearchInput placeholder="유저를 검색하세요" onChange={OnchangeHandler} value={inputValue} />
      <div className="searchuser_item w-full">
        {lists.length === 0 && !isSearch ? (
          <div className="flex justify-center mt-3">검색하신 유저가 없습니다.</div>
        ) : null}
        {lists.map(list => (
          <div
            className="w-11/12 flex flex-row align-center justgap-2 p-2.5 border-b-2 border-white mx-auto"
            key={list.userId}
          >
            <div>
              <FriendProfile user={list} />
            </div>
            <div className="flex flex-col gap-0.5 ml-auto justify-center text-sm">
              <div className="cursor-pointer" onClick={e => handleChatClick(list, e)}>
                채팅
              </div>
              <div className="cursor-pointer" onClick={() => HandleFollowClick(list.userId)}>
                팔로우
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
