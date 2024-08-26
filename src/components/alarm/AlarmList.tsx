import React, { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import AlarmListItem from './AlarmListItem';
import { setAlarmPage } from '../../features/alarm/alarmSlice';

export default function AlarmList() {
  const loader = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { alarmList } = useAppSelector(state => state.alarm);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        dispatch(setAlarmPage());
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const option = {
      threshold: 0.1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  return (
    <>
      {alarmList.map(item => (
        <div key={item.alarmId} className="w-full">
          <AlarmListItem alarm={item} />
        </div>
      ))}
      <div className="h-1" ref={loader}></div>
    </>
  );
}
