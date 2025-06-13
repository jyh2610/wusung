'use client';

import { INaviList } from '../const';
import { listFontStyle } from './NavList.css';
import { useRouter } from 'next/navigation';
import { routeMap } from '@/shared/const/route';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function NavList({
  list,
  isNavHover
}: {
  list: INaviList;
  isNavHover: boolean;
}) {
  const router = useRouter();
  const [routeKey, setRouteKey] = useState('');
  const [username, setUsername] = useState<string | undefined>(undefined);

  // 쿠키 값 변경 감지를 위한 useEffect
  useEffect(() => {
    const checkUsername = () => {
      const currentUsername = Cookies.get('username');
      setUsername(currentUsername);
    };

    // 초기 체크
    checkUsername();

    // 주기적으로 쿠키 체크 (1초마다)
    const interval = setInterval(checkUsername, 1000);

    return () => clearInterval(interval);
  }, []);

  // routeKey 설정을 위한 useEffect
  useEffect(() => {
    if (list.title === '우성인지펜 소개') setRouteKey('introduce_greeting');
    else if (list.title === '요금안내') setRouteKey('payment');
    else if (list.title === '공지사항') setRouteKey('inquiry');
    else if (list.title === '마이페이지') {
      if (username) {
        setRouteKey('mypage');
      } else {
        setRouteKey('');
      }
    }
  }, [list.title, username]);

  if (list.title === '마이페이지' && !routeKey) {
    return null;
  }

  return (
    <div
      className={listFontStyle}
      onClick={() =>
        routeKey && router.push(routeMap[routeKey as keyof typeof routeMap])
      }
      style={{ cursor: 'pointer' }}
    >
      {list.title}
    </div>
  );
}
