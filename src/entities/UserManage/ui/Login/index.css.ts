import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const loginContainer = style({
  width: '600px'
});

export const loginHeader = style({
  fontSize: '48px',
  fontWeight: 600,
  lineHeight: '57.28px',
  textAlign: 'center'
});

export const loginForm = style({
  height: '525px',
  borderRadius: '20px',
  padding: '60px 80px',
  boxShadow: 'rgba(90, 79, 45, 0.02)',
  backgroundColor: colors.gray_scale['default']
});
export const inputFormStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '28px'
});

export const buttonContainer = style({
  width: '440px',
  height: '56px'
});

export const loginButton = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

export const buttonGroup = style({
  marginTop: '32px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px'
});

export const loginInput = style({
  width: '100%'
});

export const label = style({
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale['700'],
  cursor: 'pointer'
});

export const findAccountSpan = style({
  margin: '0 20px'
});

export const hover = style({
  cursor: 'pointer',
  all: 'unset'
});
