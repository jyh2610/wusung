'use client'; // 클라이언트 컴포넌트임을 명시

// components/ui/Content/ManagerForm.tsx
import React, { useState, useEffect } from 'react';
// react-select 컴포넌트 임포트
import CreatableSelect from 'react-select/creatable'; // CreatableSelect로 변경
import { toast } from 'react-toastify';

// 기존 컴포넌트 임포트
import { Button, IEmail } from '@/shared/ui'; // SelectBox 임포트 제거
import { NomalInput } from '@/shared/ui/Input';

// CSS 모듈 임포트
import {
  formContainer,
  container,
  starSpan,
  labelContainer,
  header,
  emailBox, // 이메일 섹션 레이아웃을 위해 필요
  regBtn,
  inputBox
} from './index.css';
import { DaumAddressSearchButton } from '@/shared/ui/AddressSearchButton';
import {
  fixUserInfo,
  verificationCode,
  verificationNum
} from '@/entities/mypage/api';
import {
  sendSignupSmsCode,
  checkAuthenticationNumber
} from '@/entities/UserManage/api';
import { IManager } from '@/shared/type';

// 이메일 도메인 옵션 (IEmail 타입 사용)
// react-select의 options 형식 ({ value: string | number, label: string })과 일치합니다.
// label에는 드롭다운에 표시될 텍스트, value에는 선택 시 실제 사용될 값을 넣습니다.
// 현재는 label과 value가 모두 도메인으로 되어 있습니다. 사용자에게 친절하게 하려면
// label을 '네이버', '구글' 등으로 변경하는 것을 고려할 수 있습니다.
export const emailOptions: IEmail[] = [
  {
    label: 'naver.com', // 드롭다운에 표시될 텍스트
    value: 'naver.com' // 선택 시 실제 값
  },
  {
    label: 'gmail.com',
    value: 'gmail.com'
  },
  {
    label: 'daum.net',
    value: 'daum.net'
  }
];
interface ManagerFormProps {
  onCancel: () => void;
  initialData?: IManager; // optional
}
// 폼 데이터 상태를 위한 인터페이스 정의 (변경 없음)
interface ManagerFormData {
  name: string;
  position: string;
  address1: string; // 주소 첫 번째 필드
  address2: string; // 주소 두 번째 필드 (상세 주소)
  emailPrefix: string; // 이메일 아이디 부분
  emailDomain: string; // 이메일 도메인 (react-select에서 선택)
  phoneNumber: string;
  verificationCode: string; // 휴대폰 인증번호 필드
}

export function ManagerForm({ onCancel, initialData }: ManagerFormProps) {
  const address = initialData?.address || ''; // 전체 주소
  const [address1, address2] = address.split('|'); // | 기반으로 기본주소와 상세주소 나누기
  const email = initialData?.email || ''; // 이메일 주소
  const [emailPrefix, emailDomain] = email.split('@');

  // 폼 데이터 상태 선언 및 초기화
  const [formData, setFormData] = useState<ManagerFormData>({
    name: initialData?.name || '',
    position: initialData?.jobGrade || '',
    address1: address1 || '',
    address2: address2,
    emailPrefix: emailPrefix,
    emailDomain: emailDomain, // ★ 초기값을 빈 문자열로 설정하여 react-select의 플레이스홀더가 보이도록 함
    phoneNumber: initialData?.phoneNumber || '',
    verificationCode: ''
  });
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [inputValue, setInputValue] = useState<string>(''); // CreatableSelect를 위한 입력값 상태 추가

  // 타이머 효과
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // 입력 필드 값이 변경될 때 상태를 업데이트하는 범용 핸들러 (변경 없음)
  const handleInputChange = (field: keyof ManagerFormData, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // ★ CreatableSelect 값이 변경될 때 상태를 업데이트하는 핸들러
  const handleEmailDomainChange = (selectedOption: IEmail | null) => {
    if (selectedOption) {
      setFormData(prevData => ({
        ...prevData,
        emailDomain: selectedOption.value
      }));
    } else {
      // 선택이 해제된 경우
      setFormData(prevData => ({
        ...prevData,
        emailDomain: ''
      }));
    }
  };

  // 새로운 옵션 생성 핸들러
  const handleCreateOption = (inputValue: string) => {
    setFormData(prevData => ({
      ...prevData,
      emailDomain: inputValue
    }));
  };

  // 폼 제출 핸들러 (변경 없음)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('모든 필드를 올바르게 입력하고 휴대폰 인증을 완료해주세요.');
      return;
    }

    // 🔁 formData → 서버 전송용 데이터로 변환
    const submitData = {
      name: formData.name,
      jobGrade: formData.position, // position → jobGrade 로 이름 변경
      address: `${formData.address1}|${formData.address2}`.trim(), // 주소 합치기 (| 기반)
      email: `${formData.emailPrefix}@${formData.emailDomain}`,
      phoneNumber: formData.phoneNumber,
      verificationCode: formData.verificationCode
    };

    try {
      const res = await fixUserInfo(submitData);
      onCancel(); // 수정 완료 후 이전 페이지로 돌아가기
    } catch (err) {
      console.error(err);
    }
  };

  // CreatableSelect의 value prop에 전달할 '선택된 옵션 객체' 찾기
  const selectedEmailOption = formData.emailDomain
    ? { label: formData.emailDomain, value: formData.emailDomain }
    : null;

  const isFormValid = () => {
    const {
      name,
      position,
      address1,
      address2,
      emailPrefix,
      emailDomain,
      phoneNumber,
      verificationCode
    } = formData;

    // 필수 항목 모두 채워져 있고 인증 완료되었는지 확인
    return (
      name?.trim() &&
      address1?.trim() &&
      address2?.trim() &&
      emailPrefix?.trim() &&
      emailDomain?.trim() &&
      phoneNumber?.trim() &&
      verificationCode?.trim() &&
      isVerified
    );
  };

  const sendVerificationNum = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!formData.phoneNumber.trim()) {
      toast.error('휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      const response = await sendSignupSmsCode(formData.phoneNumber);
      toast.info(response);
      setShowVerification(true);
      setTimeLeft(120);
      setIsCodeSent(true);
    } catch (error) {
      console.log('인증번호 전송 실패');
      toast.error('인증번호 전송에 실패했습니다.');
    }
  };

  const verifiyCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await checkAuthenticationNumber({
        code: formData.verificationCode,
        phoneNum: formData.phoneNumber
      });

      setIsVerified(true);
      toast.success('인증이 완료되었습니다.');
    } catch (error) {
      setIsVerified(false);
      toast.error('인증번호가 유효하지 않습니다.');
    }
  };

  const onSmsVerification = async () => {
    try {
      const response = await sendSignupSmsCode(formData.phoneNumber);
      toast.info(response);
      setTimeLeft(120);
    } catch (error) {
      toast.error('인증번호 발송 중 오류가 발생했습니다');
    }
  };

  return (
    <div className={container}>
      <h2 className={header}>담당자 추가</h2>
      {/* onSubmit 핸들러를 폼 태그에 연결 */}
      <form className={formContainer} onSubmit={handleSubmit}>
        {/* 이름 필드 - 상태 연결 (변경 없음) */}
        <div>
          <NomalInput
            placeholder="이름을 입력해주세요"
            inputSize="medium"
            label={<div className={labelContainer}>이름</div>}
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('name', e.target.value)
            }
          />
        </div>

        {/* 직급 필드 - 상태 연결 (변경 없음) */}
        <div>
          <NomalInput
            placeholder="직급을 입력해주세요"
            inputSize="medium"
            label={<div className={labelContainer}>직급</div>}
            value={formData.position}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('position', e.target.value)
            }
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className={inputBox}>
            <NomalInput
              placeholder="주소를 입력해주세요"
              inputSize="medium"
              label={<div className={labelContainer}>주소</div>}
              value={formData.address1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('address1', e.target.value)
              }
              readOnly
            />
            <div className={regBtn}>
              <DaumAddressSearchButton
                onAddressSelect={address =>
                  handleInputChange('address1', address)
                }
              />
            </div>
          </div>
          <NomalInput
            inputSize="medium"
            placeholder="상세 주소를 입력해주세요"
            label={<div className={labelContainer}></div>}
            value={formData.address2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('address2', e.target.value)
            }
          />
        </div>

        <div className={emailBox}>
          <NomalInput
            placeholder="이메일을 입력해주세요"
            inputSize="medium"
            label={<div className={labelContainer}>이메일</div>}
            value={formData.emailPrefix}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('emailPrefix', e.target.value)
            }
          />

          <span>@</span>
          {/* ★ CreatableSelect 컴포넌트 사용 */}
          <CreatableSelect
            isClearable
            options={emailOptions}
            placeholder="선택 또는 입력"
            value={selectedEmailOption}
            onChange={handleEmailDomainChange}
            onCreateOption={handleCreateOption}
            onBlur={() => {
              // 포커스가 벗어날 때 입력된 값이 있으면 저장
              if (
                inputValue &&
                !emailOptions.find(option => option.value === inputValue)
              ) {
                handleCreateOption(inputValue);
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className={inputBox}>
            <NomalInput
              placeholder="번호를 입력해주세요"
              inputSize="medium"
              label={<div className={labelContainer}>휴대폰 번호</div>}
              value={formData.phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('phoneNumber', e.target.value)
              }
            />
            <div className={regBtn}>
              <Button
                onClick={sendVerificationNum}
                btnType="button"
                type="borderBrand"
                content="인증번호 받기" /* onClick 핸들러 추가 (상태와 연결하여 인증번호 발송 로직 구현) */
              />
            </div>
          </div>
          {isCodeSent && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <button
                onClick={onSmsVerification}
                disabled={timeLeft > 0}
                style={{
                  fontSize: '12px',
                  color: timeLeft > 0 ? '#999' : '#007bff',
                  backgroundColor: 'transparent',
                  cursor: timeLeft > 0 ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  padding: '0',
                  margin: '0',
                  borderRadius: '0',
                  fontWeight: '500',
                  border: 'none'
                }}
                onMouseEnter={e => {
                  if (timeLeft === 0) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                문자로 인증번호 전송
              </button>
            </div>
          )}

          {/* 인증번호 관련 그룹 */}
          {isCodeSent && !isVerified && (
            <div className={inputBox}>
              <NomalInput
                placeholder="인증번호를 입력해주세요"
                inputSize="medium"
                label={<div className={labelContainer}></div>} // 레이블 없음
                value={formData.verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('verificationCode', e.target.value)
                }
                rightElement={
                  timeLeft > 0 ? (
                    <span style={{ color: '#999', fontSize: '14px' }}>
                      {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  ) : undefined
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
          )}
        </div>

        {/* 버튼 그룹 (변경 없음) */}
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            width: '410px',
            height: '56px',
            margin: 'auto'
          }}
        >
          <Button type="borderBrand" content="취소하기" onClick={onCancel} />
          <Button
            type="brand"
            content="수정하기"
            btnType="submit"
            // disabled={isFormValid() ? true : false}
          />
        </div>
      </form>
    </div>
  );
}
