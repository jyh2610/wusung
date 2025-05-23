import React from 'react';
import { INaviList } from '../const';
import { listFontStyle } from './NavList.css';
import { useRouter } from 'next/navigation';
import { routeMap } from '@/shared/const/route';

export function NavList({
  list,
  isNavHover
}: {
  list: INaviList;
  isNavHover: boolean;
}) {
  const router = useRouter();
  let routeKey = '';
  if (list.title === '우성인지펜 소개') routeKey = 'introduce_greeting';
  else if (list.title === '요금안내') routeKey = 'payment';
  else if (list.title === '공지사항') routeKey = 'inquiry';
  else if (list.title === '마이페이지') routeKey = 'mypage';
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
