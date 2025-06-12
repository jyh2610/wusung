import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

export const menuContainer = style({
  width: '360px',
  padding: '40px',
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});

export const useDateBox = style({
  backgroundColor: colors.brand['0'],
  borderRadius: '8px',
  textAlign: 'center',
  padding: '12px 8px'
});

export const useDateTitle = style({
  color: colors.brand['400']
});
export const useDateDuration = style({
  color: colors.brand['300']
});
export const infoBox = style({
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '23.87px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[600]
});

export const menuListContainer = style({
  width: '360px',
  padding: '24px 40px',
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});
