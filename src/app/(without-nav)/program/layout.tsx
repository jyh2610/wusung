'use client';

import { colors } from '@/design-tokens';
import TemporaryDrawer from '@/entities/program/menu/DrawerMenu';
import { ProgramNav } from '@/entities/program/programNav';
import { getNotokenSubscription } from '@/entities/UserManage/api';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const drawerWidth = 300; // 사이드바 너비

function ProgramNavlayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { isLoading, error } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const subscription = await getNotokenSubscription();
      if (subscription?.data) {
        const endDate = new Date(subscription.data.endDate);
        const currentDate = new Date();

        if (endDate < currentDate) {
          toast.info('구독이 만료되었습니다. 결제 페이지로 이동합니다.');
          router.push('/payment'); // 구독이 만료된 경우 메인 페이지로 리다이렉트
        }
      }
      return subscription;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    retry: 1 // 실패 시 1번만 재시도
  });

  if (error) {
    console.error('구독 정보 확인 중 오류 발생:', error);
    toast.error('구독 정보 확인 중 오류가 발생했습니다.');
    router.push('/');
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
