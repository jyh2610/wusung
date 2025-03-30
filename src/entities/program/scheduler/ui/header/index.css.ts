import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const headerContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const titleStyle = style({
  fontWeight: '500',
  fontSize: '32px',
  lineHeight: '100%',
  letterSpacing: '0%'
});

export const printButton = style({
  fontWeight: '500',
  fontSize: '20px',
  lineHeight: '100%',
  letterSpacing: '-2.5%',
  color: colors.brand[0],
  padding: '16px 40px',
  backgroundColor: colors.brand[400],
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer'
});

export const iconStyle = style({
  display: 'flex'
});
