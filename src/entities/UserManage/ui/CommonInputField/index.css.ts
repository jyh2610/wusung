import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const inputStyle = style({
  display: 'flex',
  padding: '0 80px'
});

export const fieldContainer = style({
  width: '100%',
  display: 'flex',
  gap: '40px'
});

export const inputBox = style({
  height: '57px',
  display: 'flex'
});

export const inputContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  backgroundColor: colors.gray_scale['default'],
  padding: '80px',
  marginBottom: '28px',
  borderRadius: '40px',
  boxShadow: '0px 0px 40px 0px rgba(90, 79, 45, 0.02)'
});

export const signupBtn = style({
  borderRadius: '12px',
  fontSize: '20px',
  lineHeight: '23.87px',
  letterSpacing: '-2.5%',
  minWidth: '140px'
});
