import { CompanyInfo } from '@/entities/UserManage/ui/form/companyInfo';
import { CompanyLocation } from '@/entities/UserManage/ui/form/companyLocation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  CompanyUserInfo,
  useUserInfoStore,
  UserInfoStore
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
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export const CompanyInfoEdit = ({
  setIsWithdrawal
}: {
  setIsWithdrawal: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
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
    termOfUse: [false, false],
    emailDomain: ''
  });

  // 타입 가드 추가
  const isCompanyUser = (
    user: UserInfoStore
  ): user is CompanyUserInfo & {
    setUserInfo: (info: CompanyUserInfo) => void;
  } => {
    return user.UserType === '기업';
  };

  useEffect(() => {
    if (isCompanyUser(userInfo)) {
      setFormData(prev => ({
        ...prev,
        id: userInfo.id || '',
        representativeName: userInfo.representativeName || '',
        companyName: userInfo.companyName || '',
        corporateNumber: userInfo.corporateNumber || '',
        openingDate: userInfo.openingDate || '',
        address: userInfo.address || '',
        detailAddress: userInfo.detailAddress || '',
        phone: userInfo.phoneNumber || '',
        email: userInfo.email?.split('@')[0] || '',
        emailDomain: userInfo.email?.split('@')[1] || ''
      }));
    }
  }, [userInfo]);

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

  if (!isCompanyUser(userInfo)) {
    return null;
  }

  const handleInputChange = (
    field: keyof IFormCompany,
    value: string | { year: string; month: string; day: string }
  ) => {
    if (field === 'openingDate' && typeof value === 'object') {
      const openingDate = `${value.year}${value.month}${value.day}`;
      setUserInfo({ ...userInfo, openingDate } as any);
      setFormData(prev => ({
        ...prev,
        openingDate
      }));
    } else {
      setUserInfo({ ...userInfo, [field]: value } as any);
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSendVerification = () => {
    setShowVerification(true);
    setTimeLeft(120);
  };

  const SubmitUserInfo = async () => {
    const domainFormData = {
      ...formData,
      email: formData.email + '@' + formData.emailDomain
    };
    try {
      const response = await submitCompanyUserInfoHandler(
        domainFormData,
        profileFile as File
      );
      toast.success('회원정보가 수정되었습니다.');
      router.push('/mypage?tab=결재내역');
    } catch (error) {
      toast.error('회원정보 수정에 실패했습니다.');
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
