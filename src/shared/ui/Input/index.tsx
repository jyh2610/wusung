import React from 'react';
import { UseFormRegister } from 'react-hook-form';
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
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  rules?: object;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  inputSize = 'defaultValue',
  placeholder,
  labelInputGap = 40,
  labelSize = 176,
  labelPosition = 'default',
  name,
  rules,
  register,
  error,
  ...props
}) => {
  const isVertical = labelPosition === 'vertical';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: isVertical ? 'flex-start' : 'center',
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
        {...(register && name ? register(name, rules) : {})} // register 적용
        {...props}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
