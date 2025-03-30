import { Input } from '@headlessui/react';
import React from 'react';
import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import { VerticalLine } from '@/shared/ui/VerticalLine';
import { logout } from '../../api';
import {
  LoginStyles,
  LoginHeaderStyles,
  LoginBodyStyles,
  LoginBottomStyles,
  logoutStyles,
  LogedOutStyles
} from './Login.css';

function Logged() {
  const logOut = async () => {
    try {
      logout('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className={LoginStyles}>
        <div className={LoginHeaderStyles}>
          <p>님,</p>
          <p>오늘도 좋은 하루 되세요!</p>
        </div>
        <div className={`${LoginBodyStyles} ${LogedOutStyles}`}>
          <p>우성인지펜 사용중</p>
          <p>기한: </p>
        </div>
        <div className={LoginBottomStyles}>
          <Button
            type={'brand'}
            btnSize={'large'}
            content={'우성인지펜 실행'}
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
