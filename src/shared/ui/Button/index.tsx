import React from 'react';
import { borderButtonBase, buttonBase, buttonVariants } from './Button.css';

interface ButtonType {
  type?: 'default' | 'brand' | 'borderBrand' | 'beforeSelection';
  btnSize?: 'small' | 'medium' | 'large';
  onClick?: (e: any) => void;
  btnType?: 'button' | 'submit' | 'reset' | undefined;
  content: string;
  disabled?: boolean;
}

export const Button = ({
  btnType = 'button',
  content,
  type = 'default',
  onClick,
  disabled = false,
  ...props
}: ButtonType) => {
  return (
    <button
      type={btnType}
      disabled={disabled}
      onClick={onClick}
      className={`${buttonBase} ${buttonVariants[type]}`}
      {...props}
    >
      {content}
    </button>
  );
};

export const BorderButton = ({
  content,
  type = 'default',
  btnType,
  ...props
}: ButtonType) => {
  return (
    <button
      type={btnType}
      className={`${borderButtonBase} ${buttonVariants[type]}`}
      {...props}
    >
      {content}
    </button>
  );
};
