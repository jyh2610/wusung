'use client';

import { Button } from '@/shared/ui';
import { NomalInput } from '@/shared/ui/Input';
import React, { useEffect, useState } from 'react';
import {
  buttonContainer,
  codeContainer,
  fullButton,
  inputContainer,
  label
} from './index.css';
import { toast } from 'react-toastify';
import { formatTime } from '@/lib/utils';
import { CompleteId } from '../complete';
import { container, title } from '../index.css';
import { ResetPw } from './ResetPw';
import { useSearchParams } from 'next/navigation';
import { sendCode, findPassword } from '../../api/findInfo';
const TIME_LEFT = 300;
export const Password = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [name, setName] = useState('');
  const [phoneNum, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isSend, setIsSend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LEFT);
  const [resetPw, setResetPw] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSend && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsSend(false);
      setTimeLeft(TIME_LEFT);
    }
    return () => clearInterval(timer);
  }, [isSend, timeLeft]);

  const handleSendVerification = () => {
    setIsSend(true);
    setTimeLeft(TIME_LEFT);
    sendPhoneCode();
  };

  const sendPhoneCode = async () => {
    try {
      const res = await sendCode({
        name: '',
        userName: name,
        phoneNum
      });
      setIsSend(true);
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const checkPw = async () => {
    try {
      const res = await findPassword({
        code,
        phoneNum,
        name
      });
      setResetPw(true);
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  if (resetPw) {
    return <ResetPw />;
  }

  return (
    <>
      <div className={title}>
        {type === 'change' ? '비밀번호 재설정' : '비밀번호 찾기'}
      </div>
      <div className={container}>
        <div className={inputContainer}>
          <NomalInput
            label="아이디"
            labelInputGap={12}
            height={57}
            labelPosition="vertical"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="아이디 입력"
          />
        </div>
        <div className={inputContainer}>
          <NomalInput
            label="휴대폰 번호"
            labelInputGap={12}
            labelPosition="vertical"
            value={phoneNum}
            height={57}
            onChange={e => setPhone(e.target.value)}
            placeholder="휴대폰 번호 입력"
          />
        </div>
        {isSend && (
          <div className={codeContainer}>
            <NomalInput
              value={code}
              onChange={e => setCode(e.target.value)}
              height={57}
              placeholder="인증번호 입력"
              rightElement={
                <span style={{ color: 'red' }}>({formatTime(timeLeft)})</span>
              }
            />
            <div className={buttonContainer}>
              <Button
                content="재발송"
                type="borderBrand"
                onClick={sendPhoneCode}
              />
            </div>
          </div>
        )}
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: '12px',
            flexDirection: 'column'
          }}
        >
          <div className={fullButton}>
            {isSend ? (
              <Button content="확인" type="beforeSelection" onClick={checkPw} />
            ) : (
              <Button
                content="인증번호 받기"
                type="beforeSelection"
                onClick={handleSendVerification}
                disabled={timeLeft === 0}
              />
            )}
          </div>
          <div className={fullButton}>
            <Button content="비밀번호 찾기" />
          </div>
        </div>
      </div>
    </>
  );
};
