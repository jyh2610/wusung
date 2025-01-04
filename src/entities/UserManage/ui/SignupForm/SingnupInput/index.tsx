import React from 'react';
import { Input } from '@/shared/ui';
import { inputHeight, labelContainer, starSpan } from '../index.css';

interface Props {
  label: string;
  isNeed?: boolean;
  placeholder: string;
  validFuc?: () => boolean;
  type?: string;
}

export function SignupInput({
  label,
  isNeed = true,
  placeholder,
  validFuc,
  type = 'text'
}: Props) {
  return (
    <div className={inputHeight}>
      <Input
        placeholder={placeholder}
        type={type}
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
