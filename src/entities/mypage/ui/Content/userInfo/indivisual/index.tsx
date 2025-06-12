import { colors } from '@/design-tokens';
import { IdPw } from '@/entities/UserManage';
import { IFormIndividual } from '@/entities/UserManage/type';
import { UserInfo } from '@/entities/UserManage/ui/form/UserInfo';
import { useUserInfoStore } from '@/shared';
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

export const IndivisualInfo = ({
  setIsWithdrawal
}: {
  setIsWithdrawal: Dispatch<SetStateAction<boolean>>;
}) => {
  const userInfo = useUserInfoStore();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2분을 초 단위로
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const [emailId, emailDomain] = (userInfo.email || '').split('@');
  const [mainAddress, detailAddress] = (userInfo.address || '').split('|');

  const handleInputChange = (
    field: keyof IFormIndividual,
    value: string | { year: string; month: string; day: string }
  ) => {
    setUserInfo({ ...userInfo, [field]: value } as any);
  };

  const formData: IFormIndividual = {
    verificationCode: '',
    id: userInfo.id,
    password: '',
    passwordConfirm: '',
    name: userInfo.username,
    address: mainAddress || '',
    detailAddress: detailAddress || '',
    phone: userInfo.phoneNumber,
    email: emailId || '',
    termOfUse: [false, false],
    emailDomain: emailDomain || '',
    birth: { year: '', month: '', day: '' }
    // ...userInfo의 나머지 필드도 필요시 추가
  };
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
      const response = await submitIndivisualUserInfoHandler(
        formData,
        profileFile as File
      );
      console.log(response);
    } catch (error) {
      console.log(error);
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
            value={userInfo.id}
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
