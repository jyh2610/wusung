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
import { DaumAddressSearchButton } from '@/shared/ui/AddressSearchButton';
import {
  fixUserInfo,
  verificationCode,
  verificationNum
} from '@/entities/mypage/api';
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
    label: 'google.com',
    value: 'google.com'
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
  const [address1, address2] = address.split(','); // 쉼표로 기본주소와 상세주소 나누기
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
    phoneNumber: initialData?.phoneVerificationDTO.phoneNum || '',
    verificationCode: initialData?.phoneVerificationDTO.code || ''
  });
  const [isVerified, setIsVerified] = useState(false);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert('모든 필드를 올바르게 입력하고 휴대폰 인증을 완료해주세요.');
      return;
    }

    // 🔁 formData → 서버 전송용 데이터로 변환
    const submitData = {
      name: formData.name,
      jobGrade: formData.position, // position → jobGrade 로 이름 변경
      address: `${formData.address1} ${formData.address2}`.trim(), // 주소 합치기
      email: `${formData.emailPrefix}@${formData.emailDomain}`,
      phoneVerificationDTO: {
        code: formData.verificationCode,
        phoneNum: formData.phoneNumber
      }
    };

    try {
      const res = await fixUserInfo(submitData);
      alert('등록이 완료되었습니다.');
    } catch (err) {
      alert('등록에 실패했습니다.');
      console.error(err);
    }
  };

  // react-select의 value prop에 전달할 '선택된 옵션 객체' 찾기
  // formData.emailDomain 값과 일치하는 emailOptions 배열의 객체를 찾습니다.
  const selectedEmailOption = emailOptions.find(
    option => option.value === formData.emailDomain
  );
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
      name.trim() &&
      address1.trim() &&
      address2.trim() &&
      emailPrefix.trim() &&
      emailDomain.trim() &&
      phoneNumber.trim() &&
      verificationCode.trim() &&
      isVerified
    );
  };

  const sendVerificationNum = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!formData.phoneNumber.trim()) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      await verificationNum(formData.phoneNumber);
      alert('인증번호가 발송되었습니다.');
    } catch {
      console.log('인증번호 전송 실패');
      alert('인증번호 전송에 실패했습니다.');
    }
  };

  const verifiyCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await verificationCode({
        code: formData.verificationCode,
        phoneNum: formData.phoneNumber
      });

      setIsVerified(true);
      alert('인증이 완료되었습니다.');
    } catch (error) {
      setIsVerified(false);
      alert('인증번호가 유효하지 않습니다.');
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
