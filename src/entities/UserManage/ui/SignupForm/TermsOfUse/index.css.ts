import { style } from '@vanilla-extract/css';

export const selectContainer = style({
  display: 'flex',
  gap: '60px'
});

export const labelContainer = style({
  width: '176px',
  fontSize: '28px',
  lineHeight: '33.41px'
});

export const selectBox = style({
  width: '604px',
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '23.87px',
  letterSpacing: '-2.5%'
});

export const iconSize = style({
  width: '23.33px',
  height: '23.33px',
  position: 'relative'
});
