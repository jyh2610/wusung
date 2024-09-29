import { style, styleVariants } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

const baseButton = style({
  borderRadius: '12px',
  padding: '12px 40px',
  cursor: 'pointer',
  color: 'white',
  transition: 'background-color 0.3s ease',
  border: '1px solid green'
});

const backgroundButton = styleVariants({
  default: {
    backgroundColor: '#3498db'
  },
  hover: {
    backgroundColor: '#2980b9'
  }
});

const transparentButton = style({
  backgroundColor: 'transparent',
  border: '1px solid white'
});

const disabledButton = style({
  opacity: 0.6,
  pointerEvents: 'none'
});

export const buttonStyles = {
  base: baseButton,
  background: backgroundButton,
  transparent: transparentButton,
  disabled: disabledButton
};
