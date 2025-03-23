import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/shared/ui';
import { inputHeight, labelContainer, starSpan } from '../index.css';

interface Props {
  label: string;
  isNeed?: boolean;
  placeholder: string;
  register?: UseFormRegisterReturn;
  type?: string;
  name?: string;
  rules?: object;
  error?: string;
  value?: string;
}

export function SignupInput({
  label,
  isNeed = true,
  placeholder,
  register,
  name,
  rules,
  error,
  value,
  type = 'text'
}: Props) {
  return (
    <div
      style={{
        width: '100%'
      }}
    >
      <div className={inputHeight}>
        <Input
          type={type}
          placeholder={placeholder}
          error={error}
          label={
            <div className={labelContainer}>
              <span>{label}</span>
              {isNeed && <span className={starSpan}>*</span>}
            </div>
          }
          {...(register ? register : {})} // ✅ register를 직접 적용
        />
      </div>
    </div>
  );
}
