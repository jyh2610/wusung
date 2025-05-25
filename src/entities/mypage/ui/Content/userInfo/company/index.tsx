import { CompanyInfo } from '@/entities/UserManage/ui/form/companyInfo';
import { CompanyLocation } from '@/entities/UserManage/ui/form/companyLocation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  CompanyUserInfo,
  useUserInfoStore
} from '@/shared/stores/EditUserInfostore';
import { IFormCompany } from '@/entities/UserManage/type';
import { IdPw } from '@/entities/UserManage';
import { HorizontalLine, VerticalLine } from '@/shared/ui/VerticalLine';
import { colors } from '@/design-tokens';
import { submitCompanyUserInfoHandler } from '../api';
import { ProfileImageUpload } from '../ProfileImageUpload';
import {
  companyEditContainer,
  profileLabel,
  profileWrapper
} from './index.css';
import { Button } from '@/shared/ui';
import { buttonContainer } from '../index.css';

export const CompanyInfoEdit = ({
  setIsWithdrawal
}: {
  setIsWithdrawal: Dispatch<SetStateAction<boolean>>;
}) => {
  const userInfo = useUserInfoStore();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2분을 초 단위로
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const companyUserInfo = userInfo as CompanyUserInfo; // 또는 as CompanyUserInfo

  // IFormCompany에 맞는 핸들러
  const handleInputChange = (
    field: keyof IFormCompany,
    value: string | { year: string; month: string; day: string }
  ) => {
    setUserInfo({ ...userInfo, [field]: value } as any);
  };

  const formData: IFormCompany = {
    verificationCode: '',
    id: companyUserInfo.id,
    password: '',
    passwordConfirm: '',
    representativeName: companyUserInfo.representativeName,
    companyName: companyUserInfo.companyName,
    corporateNumber: companyUserInfo.corporateNumber,
    openingDate: companyUserInfo.openingDate,
    address: companyUserInfo.address,
    detailAddress: companyUserInfo.detailAddress,
    phone: companyUserInfo.phoneNumber,
    phoneCode: '',
    email: companyUserInfo.email,
    termOfUse: [false, false],
    emailDomain: ''
    // ...userInfo의 나머지 필드도 필요시 추가
  };

  // 아래 핸들러들도 zustand 상태로 관리하거나, 필요시 추가 구현
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

  const SubmitUserInfo = async () => {
    try {
      const response = await submitCompanyUserInfoHandler(
        formData,
        profileFile as File
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={companyEditContainer}>
      <div className={profileWrapper}>
        <label className={profileLabel}>프로필</label>
        <ProfileImageUpload
          value={userInfo.profilePictureUrl}
          onChange={setProfileFile}
        />
      </div>
      <IdPw formData={formData} handleInputChange={handleInputChange} />
      <div style={{ width: '100%' }}>
        <HorizontalLine width="100%" color={colors.gray_scale[300]} />
      </div>
      <CompanyInfo formData={formData} handleInputChange={handleInputChange} />
      <div style={{ width: '100%' }}>
        <HorizontalLine width="100%" color={colors.gray_scale[300]} />
      </div>
      <CompanyLocation
        formData={formData}
        handleInputChange={handleInputChange}
        onSendVerification={handleSendVerification}
        showVerification={showVerification}
        timeLeft={timeLeft}
        setShowVerification={setShowVerification}
      />
      <div>
        <div className={buttonContainer}>
          <Button content="회원정보 수정" onClick={SubmitUserInfo} />
        </div>
        <div className={buttonContainer}>
          <Button content="회원탈퇴" onClick={() => setIsWithdrawal(true)} />
        </div>
      </div>
    </div>
  );
};
