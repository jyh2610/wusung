'use client';

import { useEffect } from 'react';
import { syncTokenFromLocalStorage } from '@/lib/utils';

export const TokenSync = () => {
  useEffect(() => {
    // 컴포넌트 마운트 시 토큰 동기화
    syncTokenFromLocalStorage();

    // 로컬 스토리지 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userInfo') {
        syncTokenFromLocalStorage();
      }
    };

    // 다른 탭에서의 로컬 스토리지 변경 감지
    window.addEventListener('storage', handleStorageChange);

    // 페이지 포커스 시 토큰 동기화 (다른 탭에서 로그인/로그아웃 후 돌아올 때)
    const handleFocus = () => {
      syncTokenFromLocalStorage();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다
};
