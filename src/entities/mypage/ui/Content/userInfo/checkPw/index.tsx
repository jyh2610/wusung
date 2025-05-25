import React, { useState } from 'react';
import { NomalInput } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { checkPwHandler } from '../api';
import { useUserInfoStore } from '@/shared/stores/EditUserInfostore';
import {
  title,
  subTitle,
  container,
  label,
  inputContainer,
  errorText,
  buttonContainer
} from './index.css';

interface CheckPwProps {
  onSuccess: () => void;
}

export const CheckPw = ({ onSuccess }: CheckPwProps) => {
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);

  const handleCheckPw = async () => {
    if (!pw) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await checkPwHandler(pw);
      const { info, UserType: userType } = data.data;

      setUserInfo({ ...info, UserType: userType } as any);
      onSuccess();
    } catch (err: any) {
      setError('비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
      console.error('비밀번호 확인 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheckPw();
    }
  };

  return (
    <div className={container}>
      <p className={title}>비밀번호 재확인</p>
      <p className={subTitle}>현재 비밀번호를 입력해주세요.</p>

      <div className={inputContainer}>
        <NomalInput
          placeholder="현재 비밀번호를 입력해주세요."
          label={<span className={label}>비밀번호</span>}
          value={pw}
          type="password"
          onChange={e => setPw(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {error && <p className={errorText}>{error}</p>}
      </div>

      <div className={buttonContainer}>
        <Button
          content={loading ? '확인 중...' : '확인'}
          type="beforeSelection"
          onClick={handleCheckPw}
          disabled={loading}
        />
      </div>
    </div>
  );
};
