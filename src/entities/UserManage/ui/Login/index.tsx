import React from 'react';
import { Button, Input } from '@/shared/ui';

export function LoginModal() {
  return (
    <div>
      <div>
        <span>로그인</span>
      </div>
      <form>
        <div>
          <Input
            label={<div>아이디</div>}
            labelPosition="vertical"
            placeholder="아이디를 입력해주세요"
          />
          <Input
            label={<div>비밀번호</div>}
            labelPosition="vertical"
            type="password"
            placeholder="비밀번호를 입력해주세요"
          />
        </div>
        <div>
          <div>
            <Button content="로그인" />
          </div>
          <div>
            <Button content="회원가입" />
          </div>
        </div>
      </form>

      <div>
        <span>아이디 찾기</span>
        <span>|</span>
        <span>비밀번호 찾기</span>
      </div>
    </div>
  );
}
