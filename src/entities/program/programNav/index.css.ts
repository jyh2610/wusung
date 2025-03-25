import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  width: '100%',
  backgroundColor: colors.brand[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '7px 20px ',
  zIndex: '99'
});

export const navBtnContainer = style({
  display: 'flex',
  alignContent: 'center',
  gap: '12px'
});
export const imgContainer = style({
  position: 'relative',
  width: '24px',
  height: '24px',
  margin: 'auto'
});

export const textAlign = style({
  display: 'flex',
  alignItems: 'center'
});

export const userInfoContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px'
});
