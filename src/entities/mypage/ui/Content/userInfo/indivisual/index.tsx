'use client';

import { colors } from '@/design-tokens';
import { IdPw } from '@/entities/UserManage';
import { IFormIndividual } from '@/entities/UserManage/type';
import { UserInfo } from '@/entities/UserManage/ui/form/UserInfo';
import {
  useUserInfoStore,
  IndividualUserInfo,
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
import { profileLabel, profileWrapper } from '../company/index.css';
import { ProfileImageUpload } from '../ProfileImageUpload';
import { useRouter } from 'next/navigation';
import { submitIndivisualUserInfoHandler } from '../api';
import { Modal } from '@/shared/ui';
import {
  modalTitle,
  fullButton
} from '@/entities/UserManage/FindInfo/Id/index.css';
import { sendSignupSmsCode } from '@/entities/UserManage/api';
import { toast } from 'react-toastify';

export const IndivisualInfo = ({
  setIsWithdrawal
}: {
  setIsWithdrawal: Dispatch<SetStateAction<boolean>>;
}) => {
  const userInfo = useUserInfoStore();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<IFormIndividual>({
    verificationCode: '',
    id: '',
    password: '',
    passwordConfirm: '',
    name: '',
    address: '',
    detailAddress: '',
    phone: '',
    email: '',
    termOfUse: [false, false],
    emailDomain: '',
    birth: {
      year: '',
      month: '',
      day: ''
    }
  });

  const router = useRouter();
  const [emailId, emailDomain] = (userInfo.email || '').split('@');
  const [mainAddress, detailAddress] = (userInfo.address || '').split('|');

  // 타입 가드 추가
  const isIndividualUser = (
    user: UserInfoStore
  ): user is IndividualUserInfo & {
    setUserInfo: (info: IndividualUserInfo) => void;
  } => {
    return user.UserType === '개인';
  };

  useEffect(() => {
    if (isIndividualUser(userInfo)) {
      setFormData(prev => ({
        ...prev,
        id: userInfo.username || '',
        name: userInfo.name || '',
        address: mainAddress || '',
        detailAddress: detailAddress || '',
        phone: userInfo.phoneNumber || '',
        email: emailId || '',
        emailDomain: emailDomain || '',
        birth: {
          year: userInfo.birthOrEstablishmentDate?.substring(0, 4) || '',
          month: userInfo.birthOrEstablishmentDate?.substring(4, 6) || '',
          day: userInfo.birthOrEstablishmentDate?.substring(6, 8) || ''
        }
      }));
    }
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

  const handleInputChange = (
    field: keyof IFormIndividual,
    value: string | { year: string; month: string; day: string }
  ) => {
    if (field === 'birth' && typeof value === 'object') {
      const birthDate = `${value.year}${value.month}${value.day}`;
      setUserInfo({ ...userInfo, birthOrEstablishmentDate: birthDate } as any);
      setFormData(prev => ({
        ...prev,
        birth: value
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
      await submitIndivisualUserInfoHandler(
        domainFormData,
        profileFile as File
      );
      router.push('/mypage?tab=결제내역');
    } catch (error) {
      console.log(error);
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
    <div className={container}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
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
          height: '100%',
          backgroundColor: colors.gray_scale.default
        }}
      >
        <UserInfo
          formData={formData}
          handleInputChange={handleInputChange}
          showVerification={showVerification}
          setShowVerification={setShowVerification}
          timeLeft={timeLeft}
          onSendVerification={handleSendVerification}
          onSmsVerification={smsCode}
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
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalSize={{ width: '494px', height: '224px', borderRadius: '40px' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
            height: '100%'
          }}
        >
          <div>
            <p className={modalTitle}>비밀번호가 재설정되었어요!</p>
            <p className={modalTitle}>새로운 비밀번호로 로그인해주세요</p>
          </div>
          <div className={fullButton} style={{ width: '200px' }}>
            <Button
              content="확인"
              type="brand"
              onClick={() => router.push('/')}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
