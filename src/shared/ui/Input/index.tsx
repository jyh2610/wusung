import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
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
  register?: UseFormRegisterReturn;
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
      <div
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: isVertical ? 'flex-start' : 'center',
          gap: `${labelInputGap}px`,
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        <input
          style={{}}
          type={type}
          placeholder={placeholder}
          className={`${inputClass} ${inputSizeClass[inputSize]}`}
          {...(register ? register : {})} // register 적용
          {...props}
        />
        <p
          style={{
            top: '68px',
            left: '10px',
            color: 'red',
            position: 'absolute'
          }}
        >
          {error}
        </p>
      </div>
    </div>
  );
};
