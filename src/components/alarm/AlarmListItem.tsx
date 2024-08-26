import React from 'react';
import { timeAgo } from '../../utils/TimeAgo';
import { Alarm } from '../../interface/alarm';
import { Channel } from './ChannelFunc';
import { deleteAlamrAPI, readAlarm } from '../../apis/alarm';
import { useAppDispatch } from '../../store/hooks/hook';
import { decrementUnRead, deleteAlarm, readAlarmUpdate } from '../../features/alarm/alarmSlice';
import { useNavigate } from 'react-router-dom';

interface AlarmItemProps {
  alarm: Alarm;
}
export default function AlarmListItem({ alarm }: AlarmItemProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { alarmChannelId, content, createdAt, alarmId, isRead, relatedId } = alarm;
  const handleReadAlarm = async (alarmId: number) => {
    try {
      await readAlarm(alarmId);
      dispatch(decrementUnRead());
      dispatch(readAlarmUpdate(alarmId));
    } catch (err) {
      // console.log(err);
    }

    //알람을 읽은과 동시에 이동시키는게 중요할듯!
    //1번 채널은  팔로우
    //2번 채널은  피드
    if (alarmChannelId === 1) {
      navigate(`/mypage/${relatedId}`);
    } else if (alarmChannelId === 2) {
      navigate(`/community/${relatedId}`);
    } else if (alarmChannelId === 3) {
      navigate(`/dance/${relatedId}`);
    } else if (alarmChannelId === 4) {
      navigate(`/community/${relatedId}`);
    } else if (alarmChannelId === 5) {
      navigate(`/community/${relatedId}`);
    }
  };

  const handleDeleteAlarm = async (alarmId: number) => {
    dispatch(decrementUnRead());
    dispatch(readAlarmUpdate(alarmId));
    dispatch(deleteAlarm(alarmId));
    try {
      await deleteAlamrAPI(alarmId);
    } catch (err: unknown) {
      // console.log(err)
    }
  };

  return (
    <div className="alarmlistitem">
      <div className="cont w-9/12 cursor-pointer" onClick={() => handleReadAlarm(alarmId)}>
        <div className="flex flex-row gap-3 w-full">
          <div className="nickname">{content.substring(0, content.indexOf('님'))}</div>
          <div>{Channel(alarmChannelId)}</div>
          {!isRead ? <div className="rounded-full w-2.5 h-2.5 bg-white my-auto"></div> : null}
        </div>
        <div className="content w-11/12 break-all">{content}</div>
      </div>
      <div
        className="cursor-pointer text-sm absolute right-3 bottom-2"
        onClick={() => handleDeleteAlarm(alarmId)}
      >
        삭제
      </div>
      <div className="lastchattime">{timeAgo(createdAt)}</div>
    </div>
  );
}
