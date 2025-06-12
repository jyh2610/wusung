'use client';

import React, { useState } from 'react';
import { container, title } from './index.css';
import { useUserInfoStore } from '@/shared/stores/EditUserInfostore';
import { IndivisualInfo } from './indivisual';
import { CompanyInfoEdit } from './company';
import { CheckPw } from './checkPw';
import { Withdrawal } from './widrawer';
export const EditUserInfo = () => {
  const { UserType: userType } = useUserInfoStore();
  const [isPwChecked, setIsPwChecked] = useState(false);
  const [isWithdrawal, setIsWithdrawal] = useState(false);

  const renderEditForm = () => {
    return userType === '개인' ? (
      <IndivisualInfo setIsWithdrawal={setIsWithdrawal} />
    ) : (
      <CompanyInfoEdit setIsWithdrawal={setIsWithdrawal} />
    );
  };

  if (isWithdrawal) return <Withdrawal />;

  return (
    <div className={container}>
      <h1 className={title}>회원정보 수정</h1>
      {isPwChecked ? (
        renderEditForm()
      ) : (
        <CheckPw onSuccess={() => setIsPwChecked(true)} />
      )}
    </div>
  );
};
