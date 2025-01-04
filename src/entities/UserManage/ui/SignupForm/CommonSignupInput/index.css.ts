import { style } from '@vanilla-extract/css';

export const searchAddress = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px'
});

export const inputBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});

export const emailBox = style({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  alignItems: 'center'
});
