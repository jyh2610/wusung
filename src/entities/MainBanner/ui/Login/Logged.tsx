'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { logout } from '../../api';
import {
  LoginStyles,
  LoginHeaderStyles,
  LoginBodyStyles,
  LoginBottomStyles,
  logoutStyles,
  LogedOutStyles
} from './Login.css';
import { colors } from '@/design-tokens';
import { toast } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { useIsAdmin } from '@/components/hooks/useIsAdmin';
import { getRole } from '@/shared/api/common';
import Cookies from 'js-cookie';

function Logged() {
  const { logout: logoutAction } = useAuthStore();
  const router = useRouter();
  const cookie = Cookies.get('token') ?? null;

  const [role, setRole] = useState<string>('');

  const [userInfo, setUserInfo] = useState({
    username: '',
    endDate: '',
    isVip: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userInfoString = sessionStorage.getItem('userInfo');
      if (userInfoString) {
        try {
          const { username, endDate, isVip } = JSON.parse(userInfoString);
          setUserInfo({ username, endDate, isVip });
        } catch (error) {
          console.error('userInfo 파싱 에러:', error);
        }
      } else {
        console.log('sessionStorage에 userInfo가 없습니다.');
      }
    }
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getRole(cookie);
      setRole(userRole?.data || 'USER');
    };
    fetchRole();
  }, [cookie]);

  const logOut = async () => {
    try {
      logoutAction();
      toast.success('로그아웃 성공');
      redirect('/');
    } catch (error) {
      console.error(error);
    }
  };

  const { username, endDate } = userInfo;

  return (
    <div>
      <div className={LoginStyles}>
        <div className={LoginHeaderStyles}>
          <p>{username ? `${username}님,` : '로그인된 사용자 없음'}</p>
          <p>오늘도 좋은 하루 되세요!</p>
        </div>
        <div className={`${LoginBodyStyles} ${LogedOutStyles}`}>
          {endDate ? (
            <>
              <p>우성인지펜 사용중</p>
              <p style={{ color: colors.brand[300] }}>기한: {endDate}</p>
            </>
          ) : (
            <p>이용 중이 아닙니다</p>
          )}
        </div>

        <div className={LoginBottomStyles}>
          <Button
            onClick={() =>
              router.push(role === 'ADMIN' ? '/admin/product' : '/program')
            }
            type={'brand'}
            btnSize={'large'}
            content={role === 'ADMIN' ? '관리자 페이지' : '우성인지펜 실행'}
          />
          <button onClick={logOut} className={logoutStyles}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logged;
