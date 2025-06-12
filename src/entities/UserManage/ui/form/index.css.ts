import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '40px'
});

export const inputBox = style({
  display: 'flex',
  gap: '8px'
});

export const buttonContainer = style({
  marginTop: '20px',
  margin: 'auto',
  width: '240px',
  height: '56px'
});
