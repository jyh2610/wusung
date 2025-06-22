import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: colors.gray_scale.default,
  borderRadius: '20px',
  padding: '40px'
});
export const header = style({
  color: colors.gray_scale[900],
  fontSize: '32px',
  lineHeight: '100%',
  letterSpacing: '0%',
  fontWeight: 600
});
export const headcontainer = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const headerBtn = style({
  width: '132px',
  height: '49px'
});

export const noData = style({
  color: colors.gray_scale[600],
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '-2.5%',
  minHeight: '109px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const formContainer = style({
  marginTop: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px'
});

export const labelContainer = style({
  width: '176px',
  fontSize: '28px',
  fontWeight: '500',
  lineHeight: '33.41px',
  color: colors.gray_scale[800]
});
export const starSpan = style({
  color: colors.brand[400]
});

export const emailBox = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
});

export const regBtn = style({
  width: '140px',
  height: '56px',
  position: 'relative'
});

export const inputBox = style({ display: 'flex', gap: '12px' });
