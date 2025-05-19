import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const completeContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%'
});

export const title = style({
  fontSize: '24px',
  fontWeight: '500',
  color: colors.gray_scale['700'],
  letterSpacing: '-2.5%',
  lineHeight: '100%'
});

export const idFont = style({
  fontSize: '24px',
  fontWeight: '500',
  color: colors.gray_scale['800'],
  letterSpacing: '-2.5%',
  lineHeight: '100%'
});

export const idContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  marginTop: '32px',
  marginBottom: '80px',
  overflow: 'auto'
});

export const idItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
});

export const iconContainer = style({
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.gray_scale['100']
});

export const buttonContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%'
});
