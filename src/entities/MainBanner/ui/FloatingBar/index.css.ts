import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const floatingBar = style({
  position: 'fixed',
  top: '70vh',
  right: '2vw',
  width: '88px',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  fontSize: '16px',
  lineHeight: '25px',
  letterSpacing: '-2.5%'
});

export const floatingBarList = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: colors.brand[400],
  color: colors.brand[0],
  padding: '12px',
  borderRadius: '12px'
});

export const floatingBarItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  cursor: 'pointer'
});
