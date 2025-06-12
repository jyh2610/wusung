import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const btn = style({
  backgroundColor: colors.gray_scale['default'],
  color: colors.brand[500],
  padding: '12px 24px',
  borderRadius: '12px',
  fontSize: '20px',
  fontWeight: 500,
  letterSpacing: '-2.5%',
  lineHeight: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  gap: '6px'
});
