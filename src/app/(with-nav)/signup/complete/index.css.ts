import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: '1000px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px'
});
