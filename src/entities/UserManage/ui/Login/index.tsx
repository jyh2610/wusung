'use client';

import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { login } from '@/entities/MainBanner/api';
import { routeMap } from '@/shared';
import { Button, Input } from '@/shared/ui';
import {
  buttonContainer,
  buttonGroup,
  findAccountSpan,
  hover,
  inputFormStyle,
  label,
  loginButton,
  loginContainer,
  loginForm,
  loginHeader,
  loginInput
} from './index.css';
import { json } from 'stream/consumers';
import { useRouter } from 'next/navigation';

interface ILoginForm {
  id: string;
  password: string;
}
export function LoginModal() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ILoginForm>({
    mode: 'onSubmit',
    defaultValues: {
      id: '',
      password: ''
    }
  });

  const id = watch('id');
  const password = watch('password');
  const router = useRouter();
  const submitLogin = async () => {
    try {
      const res = await login({ userName: id, password });
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          token: res.accessToken,
          username: res.username
        })
      );
      router.push('/');
      setValue('id', '');
      setValue('password', '');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={loginContainer}>
      <div className={loginHeader}>
        <span>로그인</span>
      </div>
      <div className={loginForm}>
        <form className={inputFormStyle}>
          <div className={loginInput}>
            <Input
              label={<div className={label}>아이디</div>}
              register={register('id')}
              labelInputGap={12}
              labelPosition="vertical"
              inputSize="medium"
              placeholder="아이디를 입력해주세요"
            />
          </div>
          <div className={loginInput}>
            <Input
              label={<div className={label}>비밀번호</div>}
              labelInputGap={12}
              register={register('password')}
              labelPosition="vertical"
              inputSize="medium"
              type="password"
              placeholder="비밀번호를 입력해주세요"
            />
          </div>
        </form>

        <div className={buttonGroup}>
          <div className={loginButton}>
            <div className={buttonContainer}>
              <Button
                onClick={submitLogin}
                type="beforeSelection"
                content="로그인"
              />
            </div>
            <Link href={routeMap.signup} className={buttonContainer}>
              <Button type="borderBrand" content="회원가입" />
            </Link>
          </div>

          <div className={label}>
            <Link className={hover} href={'/signin/find/id'}>
              아이디 찾기
            </Link>
            <span className={findAccountSpan}>|</span>
            <Link className={hover} href={'/signin/find/password'}>
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
