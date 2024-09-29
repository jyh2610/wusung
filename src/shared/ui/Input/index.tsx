import React from 'react';
import { SizeTypes } from '../types';
import { inputClass, inputSizeClass } from './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputSize?: SizeTypes;
}

export const Input: React.FC<InputProps> = ({
  label,
  inputSize = 'medium',
  ...props
}) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        className={`${inputClass} ${inputSizeClass[inputSize]}`}
        {...props}
      />
    </div>
  );
};
