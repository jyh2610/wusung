'use client';

import { BeforeLogIn } from './BeforeLogIn';
import Logged from './Logged';
import { useAuthStore } from '@/shared/stores/useAuthStore'; // 로그인 상태 관리 store import
import { bannerContentsStyle } from './Login.css';
import { useEffect } from 'react';
import { ConsultationInquiry } from './ ConsultationInquiry';

export function Login() {
  // 로그인 상태 가져오기,
  const { isAuthenticated, checkAuthentication } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    checkAuthentication: state.checkAuthentication
  }));

  // 앱 로드 시 로그인 상태 확인
  useEffect(() => {
    checkAuthentication();
  }, []); // 의존성 배열을 빈 배열로 설정하여 마운트 시 한 번만 실행되도록

  return (
    <div className={bannerContentsStyle}>
      {/* 로그인 상태에 따라 컴포넌트 조건부 렌더링 */}
      {isAuthenticated ? (
        <Logged />
      ) : (
        <>
          <BeforeLogIn />
        </>
      )}
      <ConsultationInquiry />
    </div>
  );
}
