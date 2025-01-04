import React from 'react';
import { SizeTypes } from '../types';
import { inputClass, inputSizeClass } from './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  label?: string | React.ReactNode;
  placeholder?: string;
  inputSize?: SizeTypes;
  labelInputGap?: number;
  labelSize?: number;
  labelPosition?: 'default' | 'vertical';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  inputSize = 'defaultValue',
  placeholder,
  labelInputGap = 40,
  labelSize = 176,
  labelPosition = 'default',
  ...props
}) => {
  const isVertical = labelPosition === 'vertical';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row', // 세로 정렬 조건 추가
        alignItems: isVertical ? 'flex-start' : 'center', // 세로 정렬 시 왼쪽 정렬
        gap: `${labelInputGap}px`,
        width: '100%',
        height: '100%'
      }}
    >
      {label && <label style={{ width: `${labelSize}px` }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={`${inputClass} ${inputSizeClass[inputSize]}`}
        {...props}
      />
    </div>
  );
};
