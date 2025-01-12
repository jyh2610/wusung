import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/shared/ui';
import { inputHeight, labelContainer, starSpan } from '../index.css';

interface Props {
  label: string;
  isNeed?: boolean;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  type?: string;
  name?: string;
  rules?: object;
  error?: string;
}

export function SignupInput({
  label,
  isNeed = true,
  placeholder,
  register,
  name,
  rules,
  error,
  type = 'text'
}: Props) {
  return (
    <div className={inputHeight}>
      <Input
        name={name}
        placeholder={placeholder}
        type={type}
        register={register}
        rules={rules}
        error={error}
        label={
          <div className={labelContainer}>
            <span>{label}</span>
            {isNeed && <span className={starSpan}>*</span>}
          </div>
        }
      />
    </div>
  );
}
