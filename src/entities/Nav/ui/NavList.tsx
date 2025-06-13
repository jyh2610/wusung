'use client';

import { INaviList } from '../const';
import { listFontStyle } from './NavList.css';
import { useRouter } from 'next/navigation';
import { routeMap } from '@/shared/const/route';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export function NavList({
  list,
  isNavHover
}: {
  list: INaviList;
  isNavHover: boolean;
}) {
  const router = useRouter();
  const [routeKey, setRouteKey] = useState('');
  const { username } = useAuthStore();

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
