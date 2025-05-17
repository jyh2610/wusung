import { NomalInput } from '@/shared/ui/Input';
import React, { useState } from 'react';
import { labelContainer, starSpan } from '../SignupForm/index.css';
import { SelectBox } from '@/shared';
import {
  birthContainer,
  birthLabelBox,
  birthBox,
  birthDropdown,
  emailBox
} from '../SignupForm/CommonSignupInput/index.css';
import {
  generateYears,
  generateMonths,
  generateDays
} from '../SignupForm/utils';
import { regBtn } from '@/entities/mypage/ui/Content/setting/index.css';
import { Button, DaumAddressSearchButton, IEmail } from '@/shared/ui';
import Select, { SingleValue } from 'react-select';
import { container, inputBox } from './index.css';
import { IFormIndividual } from '../../type';
import { validateBirthDate } from '@/lib/vaildatrion';

interface IProps {
  formData: IFormIndividual;
  handleInputChange: (
    field: keyof IFormIndividual,
    value: string | { year: string; month: string; day: string }
  ) => void;
  showVerification: boolean;
  timeLeft: number;
  onSendVerification: () => void;
}

export const emailOptions: IEmail[] = [
  {
    label: 'naver.com', // 드롭다운에 표시될 텍스트
    value: 'naver.com' // 선택 시 실제 값
  },
  {
    label: 'google.com',
    value: 'google.com'
  },
  {
    label: 'daum.net',
    value: 'daum.net'
  }
];

export const UserInfo = ({
  formData,
  handleInputChange,
  showVerification,
  timeLeft,
  onSendVerification
}: IProps) => {
  const [birthError, setBirthError] = useState<string>('');

  const yearList = generateYears();
  const monthList = generateMonths();
  const dayList = generateDays(2025, 1);
  console.log(formData);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  function handleEmailDomainChange(selectedOption: SingleValue<IEmail>): void {
    if (selectedOption) {
      handleInputChange('emailDomain', selectedOption.value);
    }
  }

  const handleBirthChange = (
    field: 'year' | 'month' | 'day',
    value: string
  ) => {
    const newBirth = {
      ...formData.birth,
      [field]: value
    };

    handleInputChange('birth', newBirth);

    // 모든 필드가 입력되었을 때만 유효성 검사
    if (newBirth.year && newBirth.month && newBirth.day) {
      const validation = validateBirthDate(newBirth);
      setBirthError(validation.message);
    } else {
      setBirthError('');
    }
  };

  return (
    <div className={container}>
      <NomalInput
        placeholder="이름을 입력해주세요"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('name', e.target.value)
        }
        inputSize="medium"
        label={
          <div className={labelContainer}>
            이름<span className={starSpan}>*</span>
          </div>
        }
      />
      <div className={birthContainer}>
        <label className={birthLabelBox}>생년월일</label>
        <div className={birthBox}>
          <div className={birthDropdown}>
            <SelectBox
              options={yearList}
              placeholder={'년'}
              value={formData.birth?.year}
              onChange={(value: string) => handleBirthChange('year', value)}
            />
          </div>
          <div className={birthDropdown}>
            <SelectBox
              options={monthList}
              placeholder={'월'}
              value={formData.birth?.month}
              onChange={(value: string) => handleBirthChange('month', value)}
            />
          </div>
          <div className={birthDropdown}>
            <SelectBox
              options={dayList}
              placeholder={'일'}
              value={formData.birth?.day}
              onChange={(value: string) => handleBirthChange('day', value)}
            />
          </div>
        </div>
        {birthError && (
          <p
            style={{
              color: birthError.includes('가능') ? '#EEFCF2' : 'red',
              marginTop: '8px',
              fontSize: '14px'
            }}
          >
            {birthError}
          </p>
        )}
      </div>

      <div className={inputBox}>
        <NomalInput
          placeholder="주소를 입력해주세요"
          inputSize="medium"
          label={<div className={labelContainer}>주소</div>}
          value={formData.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange('address', e.target.value)
          }
          readOnly
        />
        <div className={regBtn}>
          <DaumAddressSearchButton
            onAddressSelect={address => handleInputChange('address', address)}
          />
        </div>
      </div>
      <NomalInput
        inputSize="medium"
        placeholder="상세 주소를 입력해주세요"
        label={<div className={labelContainer}></div>}
        value={formData.detailAddress}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('detailAddress', e.target.value)
        }
      />

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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange('phone', e.target.value)
          }
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

      {showVerification && (
        <div className={inputBox}>
          <NomalInput
            placeholder="인증번호를 입력해주세요"
            inputSize="medium"
            label={
              <div className={labelContainer}>
                인증번호{' '}
                <span style={{ color: 'red' }}>({formatTime(timeLeft)})</span>
              </div>
            }
            value={formData.verificationCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('verificationCode', e.target.value)
            }
          />
          <div className={regBtn}>
            <Button
              onClick={() => {
                /* 인증 로직 */
              }}
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
              borderRadius: '12px',
              border: state.isFocused
                ? '1px solid #1AA93E'
                : '1px solid #BFBFBF',
              boxShadow: state.isFocused ? '0 0 0 1px #1AA93E' : 'none',
              '&:hover': {
                border: '1px solid #1AA93E'
              }
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
              padding: '12px 8px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: state.isSelected ? '#1AA93E' : '#E6F7EA'
              }
            })
          }}
        />
      </div>
    </div>
  );
};
