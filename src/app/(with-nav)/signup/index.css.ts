import { style } from '@vanilla-extract/css';

export const pageContainer = style({
  minWidth: '1000px',
  height: 'calc(100vh - 303px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const inputContainer = style({
  maxWidth: '1000px',
  margin: '0 auto'
});
