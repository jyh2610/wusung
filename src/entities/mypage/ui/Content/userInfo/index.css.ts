import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';
export const container = style({
  width: '100%',
  backgroundColor: colors.gray_scale.default,
  padding: '54px 60px',
  borderRadius: '40px'
});

export const title = style({
  fontSize: '32px',
  fontWeight: '600',
  lineHeight: '32px',
  color: colors.gray_scale[900]
});
export const labelContainer = style({
  width: '176px',
  fontSize: '28px',
  fontWeight: '500',
  lineHeight: '33.41px',
  color: colors.gray_scale[800]
});

export const buttonContainer = style({
  height: '57px',
  width: '186px'
});
