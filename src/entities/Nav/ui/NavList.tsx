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
    else if (list.title === '공지사항') setRouteKey('dashboard');
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

  const handleClick = () => {
    if (!routeKey) return;

    if (list.title === '마이페이지' && list.subTitle) {
      if (list.subTitle[0] === '결제내역') {
        router.push(routeMap.mypage_payment);
      } else if (list.subTitle[0] === '문의내역') {
        router.push(routeMap.mypage_inquiry);
      } else {
        router.push(routeMap[routeKey as keyof typeof routeMap]);
      }
    } else {
      router.push(routeMap[routeKey as keyof typeof routeMap]);
    }
  };

  return (
    <div
      className={listFontStyle}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {list.title}
    </div>
  );
}
