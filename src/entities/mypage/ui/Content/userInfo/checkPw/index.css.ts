import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
  marginTop: '20px'
});

export const title = style({
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '24px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[800]
});

export const subTitle = style({
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '16px',
  color: colors.gray_scale[700]
});

export const label = style({
  fontWeight: '500',
  fontSize: '28px',
  lineHeight: '100%',
  letterSpacing: '0%'
});

export const inputContainer = style({
  height: '57px',
  width: '100%',
  marginBottom: '60px'
});
export const errorText = style({
  color: 'red',
  fontSize: '0.875rem',
  marginTop: '0.5rem'
});

export const buttonContainer = style({
  width: '200px',
  height: '57px',
  margin: '0 auto'
});
