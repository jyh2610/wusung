'use client';

import { colors } from '@/design-tokens';
import TemporaryDrawer from '@/entities/program/menu/DrawerMenu';
import { ProgramNav } from '@/entities/program/programNav';
import { getNotokenSubscription } from '@/entities/UserManage/api';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const drawerWidth = 300; // 사이드바 너비

async function ProgramNavlayout({ children }: { children: React.ReactNode }) {
  // 쿠키에서 토큰 가져오기

  // 구독 정보 확인
  const subscription = await getNotokenSubscription();
  console.log(subscription);
  if (subscription?.data) {
    const endDate = new Date(subscription.data.endDate);
    const currentDate = new Date();

    if (endDate < currentDate) {
      redirect('/'); // 구독이 만료된 경우 메인 페이지로 리다이렉트
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: colors.bg
      }}
    >
      <ProgramNav />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div style={{ width: `${drawerWidth}px`, flexShrink: 0 }}>
          <TemporaryDrawer />
        </div>
        <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
      </div>
    </div>
  );
}

export default ProgramNavlayout;
