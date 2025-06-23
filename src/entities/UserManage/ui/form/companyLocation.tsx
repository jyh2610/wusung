import React, { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';

import {
  emailBox,
  regBtn
} from '@/entities/mypage/ui/Content/setting/index.css';
import { labelContainer, starSpan } from '../SignupForm/index.css';
import { container, inputBox } from './index.css';
import { Button, DaumAddressSearchButton, IEmail } from '@/shared/ui';
import { NomalInput } from '@/shared/ui/Input';

import { IFormCompany } from '../../type';
import { checkAuthenticationNumber } from '../../api';
import { emailOptions } from './UserInfo';
import { formatTime } from '@/lib/utils';

interface IProps {
  formData: IFormCompany;
  handleInputChange: (
    field: keyof IFormCompany,
    value: string | { year: string; month: string; day: string }
  ) => void;
  onSendVerification: () => void;
  onSmsVerification: () => void;
  showVerification: boolean;
  timeLeft: number;
  setShowVerification: Dispatch<SetStateAction<boolean>>;
}

export const CompanyLocation = ({
  formData,
  handleInputChange,
  onSendVerification,
  onSmsVerification,
  showVerification,
  timeLeft,
  setShowVerification
}: IProps) => {
  const [inputValue, setInputValue] = useState<string>('');

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
          label={
            <div className={labelContainer}>
              주소 <span className={starSpan}>*</span>
            </div>
          }
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
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          position: 'relative'
        }}
      >
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
          {showVerification && (
            <div
              style={{
                position: 'absolute',
                right: '0',
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '2px'
              }}
            >
              <button
                onClick={onSmsVerification}
                style={{
                  fontSize: '12px',
                  color: '#007bff',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '0',
                  margin: '0',
                  borderRadius: '0',
                  fontWeight: '500'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                문자로 인증번호 전송
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 인증번호 입력 */}
      {showVerification && (
        <div className={inputBox}>
          <NomalInput
            placeholder="인증번호를 입력해주세요"
            inputSize="medium"
            label={<div className={labelContainer}>인증번호 </div>}
            rightElement={
              <span style={{ color: 'red' }}>({formatTime(timeLeft)})</span>
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
          label={
            <div className={labelContainer}>
              이메일<span className={starSpan}>*</span>
            </div>
          }
          value={formData.email.split('@')[0]}
          onChange={e => {
            const emailId = e.target.value;
            handleInputChange(
              'email',
              emailId + '@' + (formData.emailDomain || '')
            );
          }}
        />
        <span style={{ fontSize: '18px', color: '#333' }}>@</span>
        <CreatableSelect
          isClearable
          options={emailOptions}
          placeholder="선택 또는 입력"
          value={
            formData.emailDomain
              ? { label: formData.emailDomain, value: formData.emailDomain }
              : null
          }
          onChange={selected => {
            if (selected) {
              const emailId = formData.email.split('@')[0];
              const domainValue = selected.value;
              handleInputChange('emailDomain', domainValue);
              handleInputChange('email', emailId + '@' + domainValue);
            } else {
              // 선택이 해제된 경우
              const emailId = formData.email.split('@')[0];
              handleInputChange('emailDomain', '');
              handleInputChange('email', emailId);
            }
          }}
          onCreateOption={inputValue => {
            const emailId = formData.email.split('@')[0];
            handleInputChange('emailDomain', inputValue);
            handleInputChange('email', emailId + '@' + inputValue);
          }}
          onBlur={() => {
            // 포커스가 벗어날 때 입력된 값이 있으면 저장
            if (
              inputValue &&
              !emailOptions.find(option => option.value === inputValue)
            ) {
              const emailId = formData.email.split('@')[0];
              handleInputChange('emailDomain', inputValue);
              handleInputChange('email', emailId + '@' + inputValue);
            }
          }}
          onInputChange={newValue => {
            setInputValue(newValue);
          }}
          formatCreateLabel={inputValue => inputValue}
          styles={{
            control: (provided, state) => ({
              ...provided,
              height: '57px',
              width: '200px',
              borderRadius: '12px',
              border: state.isFocused
                ? '1px solid #1AA93E'
                : '1px solid #BFBFBF',
              boxShadow: state.isFocused ? '0 0 0 1px #1AA93E' : 'none'
            }),
            valueContainer: provided => ({
              ...provided,
              height: '100%',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center'
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
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? '#1AA93E'
                : state.isFocused
                  ? '#E6F7EA'
                  : 'white',
              color: state.isSelected ? 'white' : '#333',
              fontSize: '16px',
              padding: '12px 8px'
            })
          }}
        />
      </div>
    </div>
  );
};
