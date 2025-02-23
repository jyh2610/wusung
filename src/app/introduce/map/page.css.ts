import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  backgroundColor: colors.gray_scale['default'],
  width: '100%',
  fontSize: '18px',
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '12px'
});

export const infoTitle = style({
  width: '108px',
  display: 'flex',
  gap: '4px',
  color: colors.brand[400],
  fontWeight: 500
});

export const infoContainer = style({
  display: 'flex',
  gap: '20px',
  color: colors.gray_scale[800],
  fontWeight: 400
});
