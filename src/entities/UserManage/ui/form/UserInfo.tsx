import React, { Dispatch, SetStateAction, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';

import { NomalInput } from '@/shared/ui/Input';
import { Button, DaumAddressSearchButton, IEmail } from '@/shared/ui';
import { SelectBox } from '@/shared';

import { validateBirthDate } from '@/lib/vaildatrion';
import { checkAuthenticationNumber, verifyPhoneNum } from '../../api';

import { labelContainer, starSpan } from '../SignupForm/index.css';
import {
  birthContainer,
  birthLabelBox,
  birthBox,
  birthDropdown,
  emailBox
} from '../SignupForm/CommonSignupInput/index.css';
import { regBtn } from '@/entities/mypage/ui/Content/setting/index.css';
import { container, inputBox } from './index.css';

import {
  generateYears,
  generateMonths,
  generateDays
} from '../SignupForm/utils';
import { IFormIndividual } from '../../type';
import { formatTime } from '@/lib/utils';
interface IProps {
  formData: IFormIndividual;
  handleInputChange: (
    field: keyof IFormIndividual,
    value: string | { year: string; month: string; day: string }
  ) => void;
  showVerification: boolean;
  timeLeft: number;
  onSendVerification: () => void;
  setShowVerification: Dispatch<SetStateAction<boolean>>;
  onSmsVerification: () => void;
}

export const emailOptions: IEmail[] = [
  { label: 'naver.com', value: 'naver.com' },
  { label: 'gmail.com', value: 'gmail.com' },
  { label: 'daum.net', value: 'daum.net' }
];

export const UserInfo = ({
  formData,
  handleInputChange,
  showVerification,
  timeLeft,
  onSendVerification,
  onSmsVerification,
  setShowVerification
}: IProps) => {
  const [birthError, setBirthError] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  console.log(formData.birth, 'formData');
  const yearList = generateYears();
  const monthList = generateMonths();
  const dayList = generateDays(2025, 1); // TODO: 실제 날짜 계산 로직으로 개선 가능

  const handleBirthChange = (
    field: 'year' | 'month' | 'day',
    value: string
  ) => {
    let formattedValue = value;
    if (field === 'month' || field === 'day') {
      formattedValue = value.padStart(2, '0');
    }
    const newBirth = { ...formData.birth, [field]: formattedValue };
    handleInputChange('birth', newBirth);

    if (newBirth.year && newBirth.month && newBirth.day) {
      const validation = validateBirthDate(newBirth);
      setBirthError(validation.message);
    } else {
      setBirthError('');
    }
  };

  const handleEmailDomainChange = (selected: SingleValue<IEmail>) => {
    if (selected) {
      handleInputChange('emailDomain', selected.value);
    }
  };

  const handlePhoneVerificationSend = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      await verifyPhoneNum(formData.phone);
      toast.success('인증번호가 발송되었습니다.');
      onSendVerification();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '인증번호 발송에 실패했습니다.'
      );
    }
  };

  const handleCodeVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await checkAuthenticationNumber({
        code: formData.verificationCode,
        phoneNum: formData.phone
      });
      toast.success(res.message);
      setShowVerification(false);
    } catch (error) {
      toast.error('인증 처리 중 오류가 발생했습니다');
    }
  };

  return (
    <div className={container}>
      {/* 이름 */}
      <NomalInput
        placeholder="이름을 입력해주세요"
        onChange={e => handleInputChange('name', e.target.value)}
        inputSize="medium"
        label={
          <div className={labelContainer}>
            이름<span className={starSpan}>*</span>
          </div>
        }
        value={formData.name || ''}
      />

      {/* 생년월일 */}
      <div className={birthContainer}>
        <label className={birthLabelBox}>
          생년월일<span className={starSpan}>*</span>
        </label>
        <div className={birthBox}>
          <div className={birthDropdown}>
            <SelectBox
              options={yearList}
              placeholder="년"
              value={formData.birth?.year}
              onChange={val => handleBirthChange('year', val)}
            />
          </div>
          <div className={birthDropdown}>
            <SelectBox
              options={monthList}
              placeholder="월"
              value={formData.birth?.month?.replace(/^0+/, '')}
              onChange={val => handleBirthChange('month', val)}
            />
          </div>
          <div className={birthDropdown}>
            <SelectBox
              options={dayList}
              placeholder="일"
              value={formData.birth?.day?.replace(/^0+/, '')}
              onChange={val => handleBirthChange('day', val)}
            />
          </div>
        </div>
      </div>

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
            onAddressSelect={addr => handleInputChange('address', addr)}
          />
        </div>
      </div>

      {/* 상세주소 */}
      <NomalInput
        inputSize="medium"
        placeholder="상세 주소를 입력해주세요"
        label={<div className={labelContainer}></div>}
        value={formData.detailAddress}
        onChange={e => handleInputChange('detailAddress', e.target.value)}
      />

      {/* 이메일 */}
      <div className={emailBox}>
        <NomalInput
          placeholder="이메일을 입력해주세요"
          inputSize="medium"
          label={
            <div className={labelContainer}>
              이메일 <span className={starSpan}>*</span>
            </div>
          }
          value={formData.emailId || ''}
          onChange={e => {
            const emailId = e.target.value;
            handleInputChange('emailId', emailId);
            const domain = formData.emailDomain || '';
            handleInputChange(
              'email',
              domain ? `${emailId}@${domain}` : emailId
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
              const emailId = formData.emailId || '';
              const domainValue = selected.value;
              handleInputChange('emailDomain', domainValue);
              handleInputChange('email', `${emailId}@${domainValue}`);
            } else {
              // 선택이 해제된 경우
              const emailId = formData.emailId || '';
              handleInputChange('emailDomain', '');
              handleInputChange('email', emailId);
            }
          }}
          onCreateOption={inputValue => {
            const emailId = formData.emailId || '';
            handleInputChange('emailDomain', inputValue);
            handleInputChange('email', `${emailId}@${inputValue}`);
          }}
          onBlur={() => {
            // 포커스가 벗어날 때 입력된 값이 있으면 저장
            if (
              inputValue &&
              !emailOptions.find(option => option.value === inputValue)
            ) {
              const emailId = formData.emailId || '';
              handleInputChange('emailDomain', inputValue);
              handleInputChange('email', `${emailId}@${inputValue}`);
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

      {/* 휴대폰 및 인증 */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
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
            onClick={handlePhoneVerificationSend}
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

      {showVerification && (
        <div className={inputBox}>
          <NomalInput
            placeholder="인증번호를 입력해주세요"
            inputSize="medium"
            label={<div className={labelContainer}>인증번호</div>}
            value={formData.verificationCode}
            onChange={e => {
              handleInputChange('verificationCode', e.target.value);
            }}
            rightElement={
              <span style={{ color: 'red' }}>({formatTime(timeLeft)})</span>
            }
          />
          <div className={regBtn}>
            <Button
              onClick={handleCodeVerify}
              btnType="button"
              type="borderBrand"
              content="인증"
            />
          </div>
        </div>
      )}
    </div>
  );
};
