'use client';

import { useForm } from 'react-hook-form';
import { colors } from '@/design-tokens';
import { CommonSignupInput, LocationInfo } from '@/entities';
import { Button } from '@/shared/ui';
import { CompanyForm } from '../ui/SignupForm/Company';
import { TermsOfUse } from '../ui/SignupForm/TermsOfUse';
import {
  info,
  inputContainer,
  submitButton,
  subTitle,
  title
} from './index.css';

export function Company() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <div className={inputContainer}>
      <div
        style={{
          marginTop: '80px',
          marginBottom: '40px'
        }}
      >
        <p className={title}>회원가입</p>
        <p className={subTitle}>
          <span className={subTitle}>
            로그인에 사용할 회원 정보를 입력해주세요
          </span>
          <span className={info}>
            (
            <span
              style={{
                color: colors.brand[400]
              }}
            >
              *
            </span>
            : 필수입력 )
          </span>
        </p>
      </div>
      <form className={inputContainer} onSubmit={handleSubmit(onSubmit)}>
        <CommonSignupInput register={register} errors={errors} />
        <CompanyForm register={register} errors={errors} />
        <LocationInfo register={register} errors={errors} />
        <TermsOfUse />
        <div className={submitButton}>
          <Button type={'beforeSelection'} content={'가입하기'} />
        </div>
      </form>
    </div>
  );
}
