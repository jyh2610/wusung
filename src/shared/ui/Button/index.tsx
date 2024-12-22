import React from 'react';
import { borderButtonBase, buttonBase, buttonVariants } from './Button.css';

interface ButtonType {
  content: string;
  type?: 'default' | 'brand' | 'borderBrand' | 'beforeSelection';
  btnSize?: 'small' | 'medium' | 'large';
  onClick?: (prop?: unknown) => void;
}

export const Button = ({
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
  ...props
}: ButtonType) => {
  return (
    <button
      className={`${borderButtonBase} ${buttonVariants[type]}`}
      {...props}
    >
      {content}
    </button>
  );
};
