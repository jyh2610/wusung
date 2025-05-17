import { NomalInput } from '@/shared/ui/Input';
import React from 'react';
import { labelContainer, starSpan } from '../SignupForm/index.css';
import { SelectBox } from '@/shared';
import {
  birthContainer,
  birthLabelBox,
  birthBox,
  birthDropdown,
  inputBox,
  emailBox
} from '../SignupForm/CommonSignupInput/index.css';
import {
  generateYears,
  generateMonths,
  generateDays
} from '../SignupForm/utils';
import { regBtn } from '@/entities/mypage/ui/Content/setting/index.css';
import { Button, DaumAddressSearchButton, IEmail } from '@/shared/ui';
import { IForm } from '../../type';
import Select, { SingleValue } from 'react-select';

interface IProps {
  formData: IForm;
  handleInputChange: (field: string, value: string) => void;
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
export const UserInfo = ({ formData, handleInputChange }: IProps) => {
  const yearList = generateYears();
  const monthList = generateMonths();
  const dayList = generateDays(2025, 1);

  function sendVerificationNum(e: any): void {
    throw new Error('Function not implemented.');
  }

  function verifiyCode(e: any): void {
    throw new Error('Function not implemented.');
  }

  function handleEmailDomainChange(selectedOption: SingleValue<IEmail>): void {
    if (selectedOption) {
      handleInputChange('emailDomain', selectedOption.value);
    }
  }

  return (
    <div>
      <NomalInput
        placeholder="이름을 입력해주세요"
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
            <SelectBox options={yearList} placeholder={'년'} />
          </div>
          <div className={birthDropdown}>
            <SelectBox options={monthList} placeholder={'월'} />
          </div>
          <div className={birthDropdown}>
            <SelectBox options={dayList} placeholder={'일'} />
          </div>
        </div>
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
            onAddressSelect={address => handleInputChange('address1', address)}
          />
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
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className={inputBox}>
          <NomalInput
            placeholder="번호를 입력해주세요"
            inputSize="medium"
            label={<div className={labelContainer}>휴대폰 번호</div>}
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('phone', e.target.value)
            }
          />
          <div className={regBtn}>
            <Button
              onClick={sendVerificationNum}
              btnType="button"
              type="borderBrand"
              content="인증번호 발송" /* onClick 핸들러 추가 (상태와 연결하여 인증번호 발송 로직 구현) */
            />
          </div>
        </div>
        {/* 인증번호 관련 그룹 */}
        <div className={inputBox}>
          <NomalInput
            placeholder="인증번호를 입력해주세요"
            inputSize="medium"
            label={<div className={labelContainer}></div>} // 레이블 없음
            value={formData.verificationCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('verificationCode', e.target.value)
            }
          />
          <div className={regBtn}>
            <Button
              onClick={verifiyCode}
              btnType="button"
              type="borderBrand"
              content="인증" /* onClick 핸들러 추가 (상태와 연결하여 인증번호 발송 로직 구현) */
            />
          </div>
        </div>
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
    </div>
  );
};
