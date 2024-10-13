import React from 'react';
import { colors } from '@/design-tokens';
import { Button, Input } from '@/shared/ui';
import { VerticalLine } from '@/shared/ui/VerticalLine';
import { ConsultationInquiry } from '..';
import {
  LoginBodyStyles,
  LoginHeaderStyles,
  LoginStyles,
  LoginBottomStyles,
  bannerContentsStyle,
  InfoFucStyles,
  InfoContentStyles
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
          <Button content={'로그인'} type={'brand'} btnSize={'large'} />
          <div className={InfoFucStyles}>
            <span className={InfoContentStyles}>회원가입</span>
            <VerticalLine
              height="25px"
              thickness="1px"
              color={colors.gray_scale[300]}
            />
            <span className={InfoContentStyles}>아이디·비밀번호 찾기</span>
          </div>
        </div>
      </div>

      <div>
        <ConsultationInquiry />
      </div>
    </div>
  );
}
