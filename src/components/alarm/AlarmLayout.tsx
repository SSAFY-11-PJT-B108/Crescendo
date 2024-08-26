import React, { useEffect } from 'react';
import AlarmList from './AlarmList';
import { getAlarmList } from '../../features/alarm/alarmSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';

export default function AlarmLayout() {
  const dispatch = useAppDispatch();
  const { currentPage, size } = useAppSelector(state => state.alarm);
  useEffect(() => {
    dispatch(getAlarmList({ page: currentPage, size }));
  }, [dispatch, currentPage, size]);
  return (
    <div className="alarmlayout">
      <div className="title">알림목록</div>
      <div className="alarmlist">
        <AlarmList />
      </div>
    </div>
  );
}
