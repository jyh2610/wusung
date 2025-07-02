'use client';

import { colors } from '@/design-tokens';
import { IdPw } from '@/entities/UserManage';
import { IFormCompany } from '@/entities/UserManage/type';
import { CompanyInfo } from '@/entities/UserManage/ui/form/companyInfo';
import { CompanyLocation } from '@/entities/UserManage/ui/form/companyLocation';
import {
  useUserInfoStore,
  CompanyUserInfo,
  UserInfoStore
} from '@/shared/stores/EditUserInfostore';
import { HorizontalLine } from '@/shared/ui/VerticalLine';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { buttonContainer, labelContainer } from '../index.css';
import { NomalInput } from '@/shared/ui/Input';
import {
  container,
  row,
  label,
  input as inputStyle,
  buttonWrapper
} from './index.css';
import { Button } from '@/shared/ui/Button';
import { profileLabel, profileWrapper } from './index.css';
import { ProfileImageUpload } from '../ProfileImageUpload';
import { useRouter } from 'next/navigation';
import { submitCompanyUserInfoHandler } from '../api';
import { toast } from 'react-toastify';
import { sendSignupSmsCode } from '@/entities/UserManage/api';
import { verificationNum } from '@/entities/mypage/api';

export const CompanyInfoEdit = ({
  setIsWithdrawal
}: {
  setIsWithdrawal: Dispatch<SetStateAction<boolean>>;
}) => {
  const userInfo = useUserInfoStore();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<IFormCompany>({
    verificationCode: '',
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
    emailDomain: ''
  });

  const router = useRouter();
  const [emailId, emailDomain] = (userInfo.email || '').split('@');
  const [mainAddress, detailAddress] = (userInfo.address || '').split('|');

  // 타입 가드 추가
  const isCompanyUser = (
    user: UserInfoStore
  ): user is CompanyUserInfo & {
    setUserInfo: (info: CompanyUserInfo) => void;
  } => {
    return user.UserType === '법인';
  };

  useEffect(() => {
    // API 응답의 실제 필드명에 맞게 매핑
    setFormData(prev => ({
      ...prev,
      id: userInfo.username || '',
      representativeName: (userInfo as any).name || '', // API 응답의 name 필드 사용
      companyName: (userInfo as any).name || '', // API 응답의 name 필드 사용
      corporateNumber: (userInfo as any).businessRegistrationNumber || '', // API 응답의 businessRegistrationNumber 필드 사용
      openingDate: (userInfo as any).birthOrEstablishmentDate || '', // API 응답의 birthOrEstablishmentDate 필드 사용
      address: mainAddress || '',
      detailAddress: detailAddress || '',
      phone: userInfo.phoneNumber || '',
      email: emailId || '',
      emailId: emailId || '',
      emailDomain: emailDomain || '',
      verificationCode: '',
      password: '',
      passwordConfirm: '',
      phoneCode: '',
      termOfUse: [false, false]
    }));
  }, [userInfo, mainAddress, detailAddress, emailId, emailDomain]);

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

  const handleInputChange = (field: keyof IFormCompany, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendVerification = async () => {
    setShowVerification(true);
    setTimeLeft(120);
    await verificationNum(formData.phone);
  };

  const SubmitUserInfo = async () => {
    const domainFormData = {
      ...formData,
      email: formData.email + '@' + formData.emailDomain
    };
    try {
      await submitCompanyUserInfoHandler(domainFormData, profileFile as File);
      router.push('/mypage?tab=결제내역');
    } catch (error) {
      console.log(error);
    }
  };
  const smsCode = async () => {
    try {
      const response = await sendSignupSmsCode(formData.phone);
      toast.info(response);
      setShowVerification(true);
      setTimeLeft(120);
    } catch (error) {
      toast.error('인증번호 발송 중 오류가 발생했습니다');
    }
  };
  return (
    <div className={container}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
          marginBottom: 24
        }}
      >
        <div className={profileWrapper}>
          <label className={profileLabel}>프로필</label>
          <ProfileImageUpload
            value={userInfo.profilePictureUrl}
            onChange={setProfileFile}
          />
        </div>
        <div className={row}>
          <span className={label}>아이디</span>
          <input
            type="text"
            value={userInfo.username}
            disabled
            className={inputStyle}
          />
        </div>
        <div className={row}>
          <label className={label}>비밀번호</label>
          <div className={buttonContainer}>
            <Button
              content="비밀번호 변경"
              type="borderBrand"
              onClick={() => router.push(`/signin/find/password?type=change`)}
            />
          </div>
        </div>
      </div>
      <HorizontalLine
        width="100%"
        thickness="1px"
        color={colors.gray_scale[300]}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
          height: '100%',
          backgroundColor: colors.gray_scale.default
        }}
      >
        <CompanyInfo
          formData={formData}
          handleInputChange={handleInputChange}
          isEdit={true}
        />
        <CompanyLocation
          formData={formData}
          handleInputChange={handleInputChange}
          onSendVerification={handleSendVerification}
          showVerification={showVerification}
          timeLeft={timeLeft}
          setShowVerification={setShowVerification}
          onSmsVerification={smsCode}
          isEdit={true}
        />
      </div>
      <div className={buttonWrapper}>
        <div className={buttonContainer}>
          <Button
            content="회원정보 수정"
            type="brand"
            onClick={SubmitUserInfo}
          />
        </div>
        <div className={buttonContainer}>
          <Button content="회원탈퇴" onClick={() => setIsWithdrawal(true)} />
        </div>
      </div>
    </div>
  );
};
