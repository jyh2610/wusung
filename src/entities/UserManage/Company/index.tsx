'use client';

import { useForm } from 'react-hook-form';
import { colors } from '@/design-tokens';
import { CommonSignupInput, LocationInfo } from '@/entities';
import { Button, IEmail } from '@/shared/ui';
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
import { useState } from 'react';
import { IdPw } from '../ui/form';
import { UserInfo } from '../ui/form/UserInfo';

export function Company() {
  const [formData, setFormData] = useState<IForm>({
    id: '',
    password: '',
    passwordConfirm: '',
    representativeName: '',
    companyName: '',
    corporateNumber: '',
    openingDate: '',
    name: '',
    address: '',
    detailAddress: '',
    phone: '',
    phoneCode: '',
    email: '',
    termOfUse: [false, false],
    verificationCode: '',
    emailDomain: ''
  });

  const onSubmit = async (data: IForm) => {
    console.log(data);
    await individualSignup(data);
  };

  function handleInputChange(field: string, value: string): void {
    throw new Error('Function not implemented.');
  }

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
      <form className={inputContainer}>
        {/* <CommonSignupInput register={register} errors={errors} watch={watch} />
        <CompanyForm register={register} errors={errors} />
        <LocationInfo
          setValue={setValue}
          register={register}
          errors={errors}
          watch={watch}
        />
        <TermsOfUse setValue={setValue} watch={watch} /> */}

        <IdPw formData={formData} handleInputChange={handleInputChange} />
        <UserInfo formData={formData} handleInputChange={handleInputChange} />
        <div className={submitButton}>
          <Button
            btnType="submit"
            type={'beforeSelection'}
            content={'가입하기'}
            // onClick={() => {
            //   handleSubmit(onSubmit);
            // }}
          />
        </div>
      </form>
    </div>
  );
}
