'use client';

import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import { IFormCompany } from '../type';
import { TermsOfUse } from '../ui/SignupForm/TermsOfUse';
import {
  formContainer,
  info,
  inputContainer,
  submitButton,
  subTitle,
  title
} from './index.css';
import { useEffect, useState } from 'react';
import { IdPw } from '../ui/form';
import { CompanyInfo } from '../ui/form/companyInfo';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  checkAuthenticationNumber,
  sendSignupSmsCode,
  sendSmsCode,
  SignupCompanyRequest,
  verifyPhoneNum
} from '../api';
import { CompanyLocation } from '../ui/form/companyLocation';
import { companySignup } from '../api';
import { useRouter } from 'next/navigation';

export function Company() {
  const [formData, setFormData] = useState<IFormCompany>({
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
    phoneCode: '',
    email: '',
    emailId: '',
    termOfUse: [false, false],
    verificationCode: '',
    emailDomain: ''
  });
  console.log(formData);
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const router = useRouter();
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
    if (!formData.representativeName) {
      toast.error('대표자명을 입력해주세요.');
      return;
    }
    if (!formData.companyName) {
      toast.error('회사명을 입력해주세요.');
      return;
    }
    if (!formData.corporateNumber) {
      toast.error('사업자등록번호를 입력해주세요.');
      return;
    }
    if (!formData.openingDate) {
      toast.error('개업일을 입력해주세요.');
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
      const formattedData: SignupCompanyRequest = {
        username: formData.id,
        password: formData.password,
        passwordCheck: formData.passwordConfirm,
        address:
          formData.address && formData.detailAddress
            ? formData.address + '|' + formData.detailAddress
            : '',
        email: `${formData.email}`,
        phoneVerificationDTO: {
          code: formData.verificationCode,
          phoneNum: formData.phone
        },
        corporateVerificationDTO: {
          b_no: formData.corporateNumber,
          start_dt: formData.openingDate,
          p_nm: formData.representativeName,
          b_nm: formData.companyName
        }
      };

      const res = await companySignup(formattedData);
      if (res.status === 200) {
        window.location.href = '/signup/complete';
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '회원가입에 실패했습니다.');
    }
  };

  function handleInputChange(
    field: keyof IFormCompany,
    value: string | { year: string; month: string; day: string }
  ): void {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const handleSendVerification = async () => {
    if (!formData.phone) {
      toast.error('휴대폰 번호를 입력해주세요');
      return;
    }
    try {
      const response = await verifyPhoneNum(formData.phone);
      toast.success(response.message);
      setShowVerification(true);
      setTimeLeft(120);
    } catch (error) {
      toast.error('인증번호 발송 중 오류가 발생했습니다');
    }
  };

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
      <form onSubmit={onSubmit} className={inputContainer}>
        <div className={formContainer}>
          <IdPw formData={formData} handleInputChange={handleInputChange} />
        </div>
        <div className={formContainer}>
          <CompanyInfo
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
        <div className={formContainer}>
          <CompanyLocation
            formData={formData}
            handleInputChange={handleInputChange}
            onSendVerification={handleSendVerification}
            onSmsVerification={smsCode}
            showVerification={showVerification}
            timeLeft={timeLeft}
            setShowVerification={setShowVerification}
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
