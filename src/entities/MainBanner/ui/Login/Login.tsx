'use client';

import { useEffect, useState } from 'react';
import { BeforeLogIn } from './BeforeLogIn';
import Logged from './Logged';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { bannerContentsStyle } from './Login.css';
import { ConsultationInquiry } from './ConsultationInquiry';
import { LoginSkeleton } from './LoginSkeleton';

export function Login() {
  const { isAuthenticated, checkAuthentication } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    checkAuthentication: state.checkAuthentication
  }));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
    // 상태 확인 후 로딩 false
    setTimeout(() => {
      setLoading(false);
    }, 200); // 아주 짧은 시간 후 전환 (Zustand 상태 갱신 기다리기)
  }, []);

  return (
    <div className={bannerContentsStyle}>
      {loading ? (
        <LoginSkeleton />
      ) : isAuthenticated ? (
        <Logged />
      ) : (
        <BeforeLogIn />
      )}
      <ConsultationInquiry />
    </div>
  );
}
