import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: colors.gray_scale.default,
  marginTop: '20px',
  borderRadius: '20px',
  padding: '20px 24px'
});
