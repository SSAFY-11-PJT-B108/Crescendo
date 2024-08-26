import React, { useEffect, useRef } from 'react';
import { BASE_URL, getUserId } from '../../apis/core';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hook';
import { incrementUnRead } from '../../features/alarm/alarmSlice';

export default function SEEHandler() {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector(state => state.auth);
  const sse = useRef<EventSource | null>(null);
  useEffect(() => {
    const connectSSE = () => {
      sse.current = new EventSource(`${BASE_URL}/sse/connect/${getUserId()}`);
      sse.current.addEventListener('connect', (e: Event) => {});
      sse.current.addEventListener('alarm', (e: Event) => {
        dispatch(incrementUnRead());
      });
      sse.current.onerror = () => {
        sse.current?.close();
        setTimeout(() => {
          if (isLoggedIn) connectSSE();
        }, 5000);
      };
    };

    if (isLoggedIn) {
      connectSSE();
    }

    return () => {
      sse.current?.close();
    };
  }, [isLoggedIn, dispatch]);

  return <></>;
}
