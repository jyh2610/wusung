import React from 'react';
import { SizeTypes } from '../types';
import { inputClass, inputSizeClass } from './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  placeholder?: string;
  inputSize?: SizeTypes;
  labelInputGap?: number;
  labelSize?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  inputSize = 'defaultValue',
  placeholder,
  labelInputGap = 40,
  labelSize = 176,
  ...props
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: `${labelInputGap}px`,
        width: '100%',
        height: '100%'
      }}
    >
      {label && <label style={{ width: `${labelSize}px` }}>{label}</label>}
      <input
        placeholder={placeholder}
        className={`${inputClass} ${inputSizeClass[inputSize]}`}
        {...props}
      />
    </div>
  );
};
