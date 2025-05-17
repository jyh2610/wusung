import { NomalInput } from '@/shared/ui/Input';
import React, { useState } from 'react';
import { labelContainer, starSpan } from '../SignupForm/index.css';
import { container } from './index.css';
import { IFormCompany, IFormIndividual } from '../../type';
import { checkUserName } from '@/entities/UserManage/api';

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
        setIsIdValid(false);
        setIdError('아이디 중복 확인 중 오류가 발생했습니다.');
      }
    } else {
      setIsIdValid(null);
      setIdError('');
    }
  };

  return (
    <div className={container}>
      <div>
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
      </div>
      <div>
        <NomalInput
          placeholder="사용하실 비밀번호를 입력해주세요"
          inputSize="medium"
          type="password"
          label={
            <div className={labelContainer}>
              비밀번호 <span className={starSpan}>*</span>
            </div>
          }
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange('password', e.target.value)
          }
        />
      </div>
      <div>
        <NomalInput
          placeholder="비밀번호를 다시 한 번 입력해주세요"
          inputSize="medium"
          type="password"
          label={
            <div className={labelContainer}>
              비밀번호 확인 <span className={starSpan}>*</span>
            </div>
          }
          value={formData.passwordConfirm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange('passwordConfirm', e.target.value)
          }
        />
      </div>
    </div>
  );
};
