'use client';

import { NomalInput } from '@/shared/ui/Input';
import React, { useEffect, useState } from 'react';
import { labelContainer, starSpan } from '../SignupForm/index.css';
import { container } from './index.css';
import { IFormCompany, IFormIndividual } from '../../type';
import { checkUserName } from '@/entities/UserManage/api';
import { validatePasswordMatch } from '@/lib/utils'; // 유틸 함수 임포트
import { validatePassword } from '@/lib/vaildatrion';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

interface IProps<T extends IFormIndividual | IFormCompany> {
  formData: T;
  handleInputChange: (
    field: keyof T,
    value: string | { year: string; month: string; day: string }
  ) => void;
}

export const IdPw = <T extends IFormIndividual | IFormCompany>({
  formData,
  handleInputChange
}: IProps<T>) => {
  const [isIdValid, setIsIdValid] = useState<boolean | null>(null);
  const [idError, setIdError] = useState<string>('');
  const [pwError, setPwError] = useState<string>('');
  const [pwConfirmError, setPwConfirmError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange('id', value);

    if (value.length >= 4) {
      try {
        const response = await checkUserName(value);
        const isAvailable = response.message === '사용 가능한 아이디입니다.';
        setIsIdValid(isAvailable);
        setIdError(
          isAvailable
            ? '사용 가능한 아이디입니다.'
            : '이미 사용 중인 아이디입니다.'
        );
      } catch (error) {
        console.error(error);
        setIsIdValid(false);
        setIdError('아이디 중복 확인 중 오류가 발생했습니다.');
      }
    } else {
      setIsIdValid(null);
      setIdError('');
    }
  };

  // ✅ 실시간 비밀번호 유효성 + 일치 검사
  useEffect(() => {
    // 1. 유효성 체크
    const passwordValidationMessage = validatePassword(formData.password);
    setPwError(passwordValidationMessage);

    // 2. 일치 여부 체크
    const { isValid, message } = validatePasswordMatch(
      formData.password,
      formData.passwordConfirm
    );
    setPwConfirmError(isValid ? '' : message);
  }, [formData.password, formData.passwordConfirm]);

  return (
    <div className={container}>
      {/* 아이디 */}
      <NomalInput
        placeholder="사용하실 아이디를 입력해주세요"
        inputSize="medium"
        label={
          <div className={labelContainer}>
            아이디 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.id}
        onChange={handleIdChange}
        error={idError}
      />

      {/* 비밀번호 */}
      <NomalInput
        placeholder="사용하실 비밀번호를 입력해주세요"
        inputSize="medium"
        type={showPassword ? 'text' : 'password'}
        label={
          <div className={labelContainer}>
            비밀번호 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.password}
        onChange={e => handleInputChange('password', e.target.value)}
        error={pwError}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            tabIndex={-1}
          >
            {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
          </button>
        }
      />

      {/* 비밀번호 확인 */}
      <NomalInput
        placeholder="비밀번호를 다시 한 번 입력해주세요"
        inputSize="medium"
        type={showPasswordConfirm ? 'text' : 'password'}
        label={
          <div className={labelContainer}>
            비밀번호 확인 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.passwordConfirm}
        onChange={e => handleInputChange('passwordConfirm', e.target.value)}
        error={pwConfirmError}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            tabIndex={-1}
          >
            {showPasswordConfirm ? (
              <IoMdEyeOff size={20} />
            ) : (
              <IoMdEye size={20} />
            )}
          </button>
        }
      />
    </div>
  );
};
