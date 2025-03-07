import React from 'react';
import { borderButtonBase, buttonBase, buttonVariants } from './Button.css';

interface ButtonType {
  type?: 'default' | 'brand' | 'borderBrand' | 'beforeSelection';
  btnSize?: 'small' | 'medium' | 'large';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e: any) => void;
  btnType?: 'button' | 'submit' | 'reset' | undefined;
  content: string;
}

export const Button = ({
  btnType = 'button',
  content,
  type = 'default',
  onClick,
  ...props
}: ButtonType) => {
  return (
    <button
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
