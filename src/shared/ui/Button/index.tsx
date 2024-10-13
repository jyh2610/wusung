import React from 'react';
import { buttonBase, buttonVariants } from './Button.css';

interface ButtonType {
  content: string;
  type?: 'default' | 'brand';
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
