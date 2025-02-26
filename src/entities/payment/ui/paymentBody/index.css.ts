import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  width: '100%',
  marginTop: '12px',
  backgroundColor: colors.gray_scale['default'],
  padding: '40px',
  borderRadius: '12px'
});
