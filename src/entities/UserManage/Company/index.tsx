'use client';

import { useForm } from 'react-hook-form';
import { colors } from '@/design-tokens';
import { CommonSignupInput, LocationInfo } from '@/entities';
import { Button } from '@/shared/ui';
import { individualSignup } from '../api';
import { IForm } from '../type';
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
    setValue,
    trigger,
    formState: { errors }
  } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      id: '',
      password: '',
      passwordConfirm: '',
      representativeName: '',
      companyName: '',
      corporateNumber: '',
      openingDate: '',
      address: '',
      detailAddress: '',
      phone: '',
      email: '',
      termOfUse: [false, false]
    }
  });
  const onSubmit = async (data: IForm) => {
    console.log(data);
    await individualSignup(data);
  };

  console.log('📌 현재 폼 상태:', watch());

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
        <CompanyForm register={register} errors={errors} />
        <LocationInfo
          setValue={setValue}
          register={register}
          errors={errors}
          watch={watch}
        />
        <TermsOfUse setValue={setValue} watch={watch} />
        <div className={submitButton}>
          <Button
            btnType="submit"
            type={'beforeSelection'}
            content={'가입하기'}
            onClick={() => {
              handleSubmit(onSubmit);
            }}
          />
        </div>
      </form>
    </div>
  );
}
