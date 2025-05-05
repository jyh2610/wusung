'use client'; // 클라이언트 컴포넌트임을 명시

// components/ui/Content/ManagerForm.tsx
import React, { useState } from 'react';
// react-select 컴포넌트 임포트
import Select from 'react-select'; // react-select의 Select 컴포넌트 임포트

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
    label: 'google.com',
    value: 'google.com'
  },
  {
    label: 'daum.net',
    value: 'daum.net'
  }
];

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

export function ManagerForm({ onCancel }: { onCancel: () => void }) {
  // 폼 데이터 상태 선언 및 초기화
  const [formData, setFormData] = useState<ManagerFormData>({
    name: '',
    position: '',
    address1: '',
    address2: '',
    emailPrefix: '',
    emailDomain: '', // ★ 초기값을 빈 문자열로 설정하여 react-select의 플레이스홀더가 보이도록 함
    phoneNumber: '',
    verificationCode: ''
  });

  // 입력 필드 값이 변경될 때 상태를 업데이트하는 범용 핸들러 (변경 없음)
  const handleInputChange = (field: keyof ManagerFormData, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // ★ react-select 값이 변경될 때 상태를 업데이트하는 핸들러
  // react-select의 onChange는 선택된 '옵션 객체' 또는 null을 전달합니다.
  const handleEmailDomainChange = (selectedOption: IEmail | null) => {
    setFormData(prevData => ({
      ...prevData,
      // 선택된 옵션이 있으면 해당 value를, 없으면 빈 문자열을 상태에 저장
      emailDomain: selectedOption ? selectedOption.value : ''
    }));
  };

  // 폼 제출 핸들러 (변경 없음)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 브라우저의 기본 폼 제출 동작 방지

    console.log('폼 데이터:', formData);

    // TODO:
    // 1. 폼 유효성 검사 (필수 필드 확인 등)
    // 2. API 호출 또는 데이터 처리 로직 추가
    // 3. 제출 성공/실패 처리
  };

  // react-select의 value prop에 전달할 '선택된 옵션 객체' 찾기
  // formData.emailDomain 값과 일치하는 emailOptions 배열의 객체를 찾습니다.
  const selectedEmailOption = emailOptions.find(
    option => option.value === formData.emailDomain
  );

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
            label={
              <div className={labelContainer}>
                이름 <span className={starSpan}>*</span>
              </div>
            }
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

        <div>
          <div className={inputBox}>
            <NomalInput
              placeholder="주소를 입력해주세요"
              inputSize="medium"
              label={
                <div className={labelContainer}>
                  주소 <span className={starSpan}>*</span>
                </div>
              }
              value={formData.address1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('address1', e.target.value)
              }
            />
            <div className={regBtn}>
              <Button
                type="borderBrand"
                content="주소검색" /* onClick 핸들러 추가 (상태와 연결하여 인증번호 발송 로직 구현) */
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
            label={
              <div className={labelContainer}>
                이메일 <span className={starSpan}>*</span>
              </div>
            }
            value={formData.emailPrefix}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('emailPrefix', e.target.value)
            }
          />

          <span>@</span>
          {/* ★ react-select Select 컴포넌트 사용 */}
          <Select
            options={emailOptions}
            placeholder={'선택'}
            value={selectedEmailOption}
            onChange={handleEmailDomainChange}
            // ★ styles prop을 사용하여 높이 설정
            styles={{
              control: provided => ({
                ...provided,
                height: 57, // 높이를 57px로 설정
                minHeight: 57, // 최소 높이도 57px로 설정하여 축소 방지
                width: '200px',
                borderRadius: '12px'
              }),
              valueContainer: provided => ({
                ...provided,
                height: 'calc(57px - 8px - 8px)', // control padding 고려 (기본 8px)
                padding: '0 8px' // 기본 패딩 유지 또는 조정
              }),
              indicatorsContainer: provided => ({
                ...provided,
                height: 57 // control과 동일하게 설정
              })
            }}
          />
        </div>

        <div>
          <div className={inputBox}>
            <NomalInput
              placeholder="번호를 입력해주세요"
              inputSize="medium"
              label={
                <div className={labelContainer}>
                  휴대폰 번호 <span className={starSpan}>*</span>
                </div>
              }
              value={formData.phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('phoneNumber', e.target.value)
              }
            />
            <div className={regBtn}>
              <Button
                type="borderBrand"
                content="인증번호 받기" /* onClick 핸들러 추가 (상태와 연결하여 인증번호 발송 로직 구현) */
              />
            </div>
          </div>
          {/* 인증번호 관련 그룹 */}
          <div>
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
                type="borderBrand"
                content="인증" /* onClick 핸들러 추가 (상태와 연결하여 인증번호 발송 로직 구현) */
              />
            </div>
          </div>
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
          <Button type="brand" content="추가하기" btnType="submit" />
        </div>
      </form>
    </div>
  );
}
