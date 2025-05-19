import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const inputContainer = style({
  width: '100%'
});

export const label = style({
  fontSize: '16px',
  fontWeight: '600',
  color: colors.gray_scale['900'],
  marginBottom: '12px'
});

export const codeContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  height: '56px'
});

export const buttonContainer = style({
  height: '56px',
  width: '146px'
});

export const fullButton = style({
  height: '56px',
  width: '100%'
});
