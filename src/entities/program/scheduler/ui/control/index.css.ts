import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const controlContainer = style({
  display: 'flex',
  gap: '8px'
});

export const buttonStyle = style({
  padding: '12px 20px',
  border: `1px solid ${colors.brand[400]}`,
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '12px',
  color: colors.brand[300],
  fontSize: '20px',
  fontWeight: 500,
  letterSpacing: '-2.5%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px'
});
