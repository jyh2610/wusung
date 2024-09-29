import React from 'react';
import { SizeTypes } from '../types';
import { buttonStyles } from './Button.css';

interface ButtonProps {
  type: 'default' | 'transparent';
  content: string;
  btnSize: SizeTypes;
  disabled?: boolean;
}

export function Button({ type = 'default', content, disabled }: ButtonProps) {
  const buttonClass = disabled
    ? buttonStyles.disabled
    : type === 'transparent'
      ? buttonStyles.transparent
      : buttonStyles.base;
  return (
    <>
      <button className={`${buttonClass}`}>{content}</button>
    </>
  );
}
