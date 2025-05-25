import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const inputContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
  marginBottom: '230px'
});

export const locationContainer = style({
  backgroundColor: colors.gray_scale['default'],
  boxShadow: 'rgba(90, 79, 45, 0.02)',
  borderRadius: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: '80px'
});

export const title = style({
  fontSize: '48px',
  fontWeight: '600',
  lineHeight: '57.28px',
  textAlign: 'center',
  color: colors.gray_scale[900]
});

export const subTitle = style({
  fontSize: '24px',
  fontWeight: 400,
  lineHeight: '40px',
  letterSpacing: '-2.5%',
  textAlign: 'center',
  color: colors.gray_scale[800]
});

export const info = style({
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[700]
});

export const submitButton = style({
  width: '400px',
  height: '56px',
  margin: '0 auto'
});

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '40px',
  padding: '80px'
});
