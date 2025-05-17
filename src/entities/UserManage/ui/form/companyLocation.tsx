import React, { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';

import {
  emailBox,
  regBtn
} from '@/entities/mypage/ui/Content/setting/index.css';
import { labelContainer, starSpan } from '../SignupForm/index.css';
import { container, inputBox } from './index.css';
import { Button, DaumAddressSearchButton, IEmail } from '@/shared/ui';
import { NomalInput } from '@/shared/ui/Input';
import Select, { SingleValue } from 'react-select';

import { IFormCompany } from '../../type';
import { checkAuthenticationNumber } from '../../api';
import { emailOptions } from './UserInfo';

interface IProps {
  formData: IFormCompany;
  handleInputChange: (
    field: keyof IFormCompany,
    value: string | { year: string; month: string; day: string }
  ) => void;
  onSendVerification: () => void;
  showVerification: boolean;
  timeLeft: number;
  setShowVerification: Dispatch<SetStateAction<boolean>>;
}

export const CompanyLocation = ({
  formData,
  handleInputChange,
  onSendVerification,
  showVerification,
  timeLeft,
  setShowVerification
}: IProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      toast.error('인증번호를 입력해주세요');
      return;
    }

    try {
      const response = await checkAuthenticationNumber({
        code: formData.verificationCode,
        phoneNum: formData.phone
      });

      if (response.message === '인증이 완료되었습니다.') {
        toast.success('인증이 완료되었습니다');
        setShowVerification(false);
      } else {
        toast.error(response.message || '인증에 실패했습니다');
      }
    } catch {
      toast.error('인증 중 오류가 발생했습니다');
    }
  };

  return (
    <div className={container}>
      {/* 주소 */}
      <div className={inputBox}>
        <NomalInput
          placeholder="주소를 입력해주세요"
          inputSize="medium"
          label={<div className={labelContainer}>주소</div>}
          value={formData.address}
          onChange={e => handleInputChange('address', e.target.value)}
          readOnly
        />
        <div className={regBtn}>
          <DaumAddressSearchButton
            onAddressSelect={address => handleInputChange('address', address)}
          />
        </div>
      </div>

      {/* 상세 주소 */}
      <NomalInput
        inputSize="medium"
        placeholder="상세 주소를 입력해주세요"
        label={<div className={labelContainer}></div>}
        value={formData.detailAddress}
        onChange={e => handleInputChange('detailAddress', e.target.value)}
      />

      {/* 휴대폰 번호 및 인증 발송 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <NomalInput
          placeholder="번호를 입력해주세요"
          inputSize="medium"
          label={
            <div className={labelContainer}>
              휴대폰 번호<span className={starSpan}>*</span>
            </div>
          }
          value={formData.phone}
          onChange={e => handleInputChange('phone', e.target.value)}
        />
        <div className={regBtn}>
          <Button
            onClick={onSendVerification}
            btnType="button"
            type="borderBrand"
            content="인증번호 발송"
          />
        </div>
      </div>

      {/* 인증번호 입력 */}
      {showVerification && (
        <div className={inputBox}>
          <NomalInput
            placeholder="인증번호를 입력해주세요"
            inputSize="medium"
            label={
              <div className={labelContainer}>
                인증번호{' '}
                <span style={{ color: 'red' }}>({formatTime(timeLeft)}초)</span>
              </div>
            }
            value={formData.verificationCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('verificationCode', e.target.value)
            }
          />
          <div className={regBtn}>
            <Button
              onClick={handleVerifyCode}
              btnType="button"
              type="borderBrand"
              content="인증"
            />
          </div>
        </div>
      )}

      <div className={emailBox}>
        <NomalInput
          placeholder="이메일을 입력해주세요"
          inputSize="medium"
          label={<div className={labelContainer}>이메일</div>}
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange('email', e.target.value)
          }
        />
        <span style={{ fontSize: '18px', color: '#333' }}>@</span>
        <Select
          options={emailOptions}
          placeholder={'선택'}
          value={
            formData.emailDomain
              ? { label: formData.emailDomain, value: formData.emailDomain }
              : null
          }
          onChange={(newValue: SingleValue<IEmail>) => {
            if (newValue) {
              handleInputChange('emailDomain', newValue.value);
            }
          }}
          styles={{
            control: (provided, state) => ({
              ...provided,
              height: '57px',
              minHeight: '57px',
              width: '200px',
              borderRadius: '12px'
            }),
            valueContainer: provided => ({
              ...provided,
              height: '100%',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center'
            }),
            input: provided => ({
              ...provided,
              margin: '0',
              padding: '0'
            }),
            indicatorsContainer: provided => ({
              ...provided,
              height: '100%'
            }),
            placeholder: provided => ({
              ...provided,
              color: '#BFBFBF',
              fontSize: '16px'
            }),
            singleValue: provided => ({
              ...provided,
              color: '#333',
              fontSize: '16px'
            }),
            menu: provided => ({
              ...provided,
              borderRadius: '12px',
              overflow: 'hidden'
            })
          }}
        />
      </div>
    </div>
  );
};
