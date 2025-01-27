'use client';

import { useForm } from 'react-hook-form';
import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import {
  info,
  inputContainer,
  subTitle,
  submitButton,
  title
} from '../Company/index.css';
import {
  CommonSignupInput,
  LocationInfo
} from '../ui/SignupForm/CommonSignupInput';
import { TermsOfUse } from '../ui/SignupForm/TermsOfUse';

export function IndividualComponent() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  });

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

        <LocationInfo type={'indivisual'} register={register} errors={errors} />
        <TermsOfUse />
        <div className={submitButton}>
          <Button type={'beforeSelection'} content={'가입하기'} />
        </div>
      </form>
    </div>
  );
}
