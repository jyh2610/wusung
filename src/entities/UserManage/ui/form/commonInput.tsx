import { NomalInput } from '@/shared/ui/Input';
import React from 'react';
import { IForm } from '@/entities/UserManage/type';
import { labelContainer, starSpan } from '../SignupForm/index.css';

interface IProps {
  formData: IForm;
  handleInputChange: (field: string, value: string) => void;
}

export const IdPw = ({ formData, handleInputChange }: IProps) => {
  return (
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('id', e.target.value)
        }
      />
      <NomalInput
        placeholder="사용하실 비밀번호를 입력해주세요"
        inputSize="medium"
        label={
          <div className={labelContainer}>
            비밀번호 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('password', e.target.value)
        }
      />
      <NomalInput
        placeholder="비밀번호를 다시 한 번 입력해주세요"
        inputSize="medium"
        label={
          <div className={labelContainer}>
            비밀번호 확인 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('passwordConfirm', e.target.value)
        }
      />
    </div>
  );
};
