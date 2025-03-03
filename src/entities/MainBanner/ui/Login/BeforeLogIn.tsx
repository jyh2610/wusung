'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { colors } from '@/design-tokens';
import { routeMap, showErrorAlert, showSuccessAlert } from '@/shared';
import { Button, Input } from '@/shared/ui';
import { VerticalLine } from '@/shared/ui/VerticalLine';
import { login } from '../../api';
import { ILoginData } from '../../type';
import {
  LoginStyles,
  LoginHeaderStyles,
  LoginBodyStyles,
  LoginBottomStyles,
  InfoFucStyles,
  InfoContentStyles
} from './Login.css';
export function BeforeLogIn() {
  const [loginData, setLoginData] = useState<ILoginData>({
    userName: '',
    password: ''
  });

  const navigate = useRouter();

  const sendLogin = async () => {
    console.log(loginData);

    try {
      await login({
        userName: loginData.userName,
        password: loginData.password
      });
      showSuccessAlert('로그인 성공');
    } catch (error) {
      showErrorAlert('로그인 실패');
    }
  };

  return (
    <div className={LoginStyles}>
      <div className={LoginHeaderStyles}>
        <p>로그인</p>
      </div>
      <div className={LoginBodyStyles}>
        <Input
          label="아이디"
          inputSize="medium"
          placeholder="아이디를 입력해 주세요"
          labelPosition="vertical"
          labelInputGap={4}
          value={loginData.userName} // 추가
          onChange={e =>
            setLoginData(prev => {
              return { ...prev, userName: e.target.value };
            })
          }
        />

        <Input
          type="password"
          labelPosition="vertical"
          labelInputGap={4}
          label="비밀번호"
          inputSize="medium"
          placeholder="비밀번호를 입력해 주세요"
          value={loginData.password} // 추가
          onChange={e =>
            setLoginData(prev => {
              return { ...prev, password: e.target.value };
            })
          }
        />
      </div>
      <div className={LoginBottomStyles}>
        <div
          style={{
            height: '49px'
          }}
        >
          <Button
            onClick={sendLogin}
            content={'로그인'}
            type={'brand'}
            btnSize={'large'}
          />
        </div>
        <div className={InfoFucStyles}>
          <span
            onClick={() => navigate.push(routeMap.signup)}
            className={InfoContentStyles}
          >
            회원가입
          </span>
          <VerticalLine
            height="25px"
            thickness="1px"
            color={colors.gray_scale[300]}
          />
          <span className={InfoContentStyles}>아이디·비밀번호 찾기</span>
        </div>
      </div>
    </div>
  );
}
