import React from 'react';
import { SizeTypes } from '../types';
import { inputClass, inputSizeClass } from './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  inputSize?: SizeTypes;
}

export const Input: React.FC<InputProps> = ({
  label,
  inputSize = 'medium',
  placeholder,
  ...props
}) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        placeholder={placeholder}
        className={`${inputClass} ${inputSizeClass[inputSize]}`}
        {...props}
      />
    </div>
  );
};
