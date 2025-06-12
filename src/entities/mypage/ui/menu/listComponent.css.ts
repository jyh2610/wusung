import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const liBox = style({
  display: 'flex',
  cursor: 'pointer',
  gap: '8px',
  alignContent: 'center',
  padding: '12px 0'
});

export const text = style({
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[800]
});

export const selectedText = style([
  text,
  {
    color: colors.brand[500]
  }
]);
