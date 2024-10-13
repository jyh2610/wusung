import React from 'react';
import { borderButtonBase, buttonBase, buttonVariants } from './Button.css';

interface ButtonType {
  content: string;
  type?: 'default' | 'brand' | 'borderBrand';
  btnSize?: 'small' | 'medium' | 'large';
}

export const Button = ({
  content,
  type = 'default',
  btnSize = 'medium',
  ...props
}: ButtonType) => {
  return (
    <button className={`${buttonBase} ${buttonVariants[type]}`} {...props}>
      {content}
    </button>
  );
};

export const BorderButton = ({
  content,
  type = 'default',
  btnSize = 'medium',
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
