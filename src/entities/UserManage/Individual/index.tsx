'use client';

import { Path, PathValue, useForm } from 'react-hook-form';
import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import {
  info,
  inputContainer,
  subTitle,
  submitButton,
  title
} from '../Company/index.css';
import { IForm } from '../type';
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
    setValue,
    formState: { errors }
  } = useForm<IForm>({
    defaultValues: {
      id: '',
      password: '',
      passwordConfirm: '',
      name: '',
      address: '',
      phone: '',
      email: '',
      termOfUse: [false, false]
    }
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
        <CommonSignupInput register={register} errors={errors} watch={watch} />
        <LocationInfo
          type={'indivisual'}
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
        />
        <TermsOfUse watch={watch} setValue={setValue} />
        <div className={submitButton}>
          <Button
            btnType="submit"
            type={'beforeSelection'}
            content={'가입하기'}
            onClick={() => handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </div>
  );
}
