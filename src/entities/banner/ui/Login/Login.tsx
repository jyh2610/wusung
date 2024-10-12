import React from 'react';
import { Button, Input } from '@/shared/ui';
import { ConsultationInquiry } from '..';
import {
  LoginBodyStyles,
  LoginHeaderStyles,
  LoginStyles,
  LoginBottomStyles,
  bannerContentsStyle
} from './Login.css';

export function Login() {
  return (
    <div className={bannerContentsStyle}>
      <div className={LoginStyles}>
        <div className={LoginHeaderStyles}>
          <p>로그인</p>
        </div>
        <div className={LoginBodyStyles}>
          <Input
            label="아이디"
            inputSize="medium"
            placeholder="아이디를 입력해 주세요"
          />
          <Input
            label="비밀번호"
            inputSize="medium"
            placeholder="비밀번호를 입력해 주세요"
          />
        </div>
        <div className={LoginBottomStyles}>
          <Button content={'로그인'} type={'default'} btnSize={'large'} />
          <div>
            <span>회원가입</span>
            <span>|</span>
            <span>아이디·비밀번호 찾기</span>
          </div>
        </div>
      </div>

      <div>
        <ConsultationInquiry />
      </div>
    </div>
  );
}
