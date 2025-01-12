import React from 'react';
import { useForm } from 'react-hook-form';
import { verifyCoporate } from '@/entities/UserManage/api';
import { Button, Input } from '@/shared/ui';
import {
  buttonContainer,
  inputContainer,
  inputHeight,
  labelContainer,
  starSpan
} from '../index.css';
import { SignupInput } from '../SingnupInput';

interface IProps {
  register: ReturnType<typeof useForm>['register'];
  errors: Record<string, unknown>;
}
export function CompanyForm({ register, errors }: IProps) {
  const verifyCoeporate = async () => {
    try {
      const res = await verifyCoporate({
        b_no: '8834600572',
        start_dt: '20230101',
        p_nm: '우성인지��',
        b_nm: '우성인지��'
      });
      console.log(res);
    } catch {
      console.error('Failed to verify corporate number');
    }
  };

  return (
    <div className={inputContainer}>
      <SignupInput
        label={'대표자명'}
        placeholder={'사업주 이름을 입력해주세요'}
      />
      <SignupInput label={'기관명'} placeholder={'사업명을 입력해주세요'} />
      <SignupInput
        label={'사업자 번호'}
        placeholder={'사업자번호를 입력해주세요'}
      />
      <SignupInput
        label={'개업일자'}
        placeholder={'사업자번호를 입력해주세요'}
      />

      <div className={buttonContainer}>
        <Button
          onClick={verifyCoeporate}
          type={'borderBrand'}
          content={'기관 인증'}
        />
      </div>
    </div>
  );
}
