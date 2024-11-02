import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const listFontStyle = style({
  fontWeight: '500',
  fontSize: '32px',
  lineHeight: '38px',
  color: colors.gray_scale[800],
  textAlign: 'center',
  cursor: 'pointer',
  position: 'relative'
});
