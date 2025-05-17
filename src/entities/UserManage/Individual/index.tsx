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
import { IFormIndividual } from '../type';
import {
  CommonSignupInput,
  LocationInfo
} from '../ui/SignupForm/CommonSignupInput';
import { TermsOfUse } from '../ui/SignupForm/TermsOfUse';
import { IdPw } from '../ui/form';
import { UserInfo } from '../ui/form/UserInfo';
import { watch } from 'fs';
import { useState, useEffect } from 'react';
import { individualSignup } from '../api';
import { toast } from 'react-toastify';

export function IndividualComponent() {
  const [formData, setFormData] = useState<IFormIndividual>({
    id: '',
    password: '',
    passwordConfirm: '',
    name: '',
    address: '',
    detailAddress: '',
    phone: '',
    phoneCode: '',
    email: '',
    termOfUse: [false, false],
    verificationCode: '',
    emailDomain: '',
    birth: {
      year: '',
      month: '',
      day: ''
    }
  });

  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2분을 초 단위로

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showVerification && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowVerification(false);
      setTimeLeft(120);
    }
    return () => clearInterval(timer);
  }, [showVerification, timeLeft]);

  const handleSendVerification = () => {
    setShowVerification(true);
    setTimeLeft(120);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formattedData: IFormIndividual = {
        ...formData,
        id: formData.id,
        passwordConfirm: formData.passwordConfirm,
        detailAddress: formData.detailAddress,
        verificationCode: formData.verificationCode,
        emailDomain: formData.emailDomain,
        phoneCode: formData.phoneCode,
        termOfUse: formData.termOfUse
      };

      const res = await individualSignup(formattedData);
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  function handleInputChange(
    field: keyof IFormIndividual,
    value: string | { year: string; month: string; day: string }
  ): void {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      <form className={inputContainer} onSubmit={onSubmit}>
        <IdPw formData={formData} handleInputChange={handleInputChange} />
        <UserInfo
          formData={formData}
          handleInputChange={handleInputChange}
          showVerification={showVerification}
          timeLeft={timeLeft}
          onSendVerification={handleSendVerification}
        />
        <TermsOfUse formData={formData} handleInputChange={handleInputChange} />
        <div className={submitButton}>
          <Button
            btnType="submit"
            type={'beforeSelection'}
            content={'가입하기'}
          />
        </div>
      </form>
    </div>
  );
}
