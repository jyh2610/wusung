'use client';

import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import {
  formContainer,
  info,
  inputContainer,
  subTitle,
  submitButton,
  title
} from '../Company/index.css';
import { IFormIndividual } from '../type';
import { TermsOfUse } from '../ui/SignupForm/TermsOfUse';
import { IdPw } from '../ui/form';
import { UserInfo } from '../ui/form/UserInfo';
import { useState, useEffect } from 'react';
import {
  individualSignup,
  IndividualSignUpDTO,
  sendSignupSmsCode,
  sendSmsCode
} from '../api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export function IndividualComponent() {
  const [formData, setFormData] = useState<IFormIndividual>({
    id: '',
    password: '',
    passwordConfirm: '',
    name: '',
    address: '',
    detailAddress: '',
    phone: '',
    email: '',
    emailId: '',
    termOfUse: [false, false],
    verificationCode: '',
    emailDomain: '',
    birth: {
      year: '',
      month: '',
      day: ''
    }
  });

  const router = useRouter();

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
  console.log(formData.email);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 입력값 검증
    if (!formData.id) {
      toast.error('아이디를 입력해주세요.');
      return;
    }
    if (!formData.password) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }
    if (!formData.passwordConfirm) {
      toast.error('비밀번호 확인을 입력해주세요.');
      return;
    }
    if (!formData.name) {
      toast.error('이름을 입력해주세요.');
      return;
    }
    if (!formData.birth.year || !formData.birth.month || !formData.birth.day) {
      toast.error('생년월일을 입력해주세요.');
      return;
    }
    if (!formData.phone) {
      toast.error('전화번호를 입력해주세요.');
      return;
    }
    if (!formData.email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }
    if (!formData.emailDomain) {
      toast.error('이메일 도메인을 선택해주세요.');
      return;
    }
    if (!formData.verificationCode) {
      toast.error('인증번호를 입력해주세요.');
      return;
    }
    if (!formData.termOfUse[0] || !formData.termOfUse[1]) {
      toast.error('이용약관에 모두 동의해주세요.');
      return;
    }

    try {
      const formattedData: IndividualSignUpDTO = {
        username: formData.id,
        password: formData.password,
        passwordCheck: formData.passwordConfirm,
        name: formData.name,
        birth: `${formData.birth.year}${formData.birth.month}${formData.birth.day}`,
        address:
          formData.address && formData.detailAddress
            ? formData.address + '|' + formData.detailAddress
            : '',
        email: formData.email,
        phoneVerificationDTO: {
          code: formData.verificationCode,
          phoneNum: formData.phone
        }
      };

      const res = await individualSignup(formattedData);
      toast.success(res.data.message);
      router.push('/signin');
    } catch (error: any) {
      console.log(error);
      toast.error('회원가입 중 오류가 발생했습니다.');
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
  const smsCode = async () => {
    try {
      const response = await sendSignupSmsCode(formData.phone);
      toast.success(response);
      setShowVerification(true);
      setTimeLeft(120);
    } catch (error) {
      toast.error('인증번호 발송 중 오류가 발생했습니다');
    }
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
      <form className={inputContainer} onSubmit={onSubmit}>
        <div className={formContainer}>
          <IdPw formData={formData} handleInputChange={handleInputChange} />
        </div>
        <div className={formContainer}>
          <UserInfo
            formData={formData}
            handleInputChange={handleInputChange}
            onSmsVerification={smsCode}
            showVerification={showVerification}
            setShowVerification={setShowVerification}
            timeLeft={timeLeft}
            onSendVerification={handleSendVerification}
          />
        </div>
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
