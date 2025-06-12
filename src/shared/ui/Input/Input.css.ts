import { style, styleVariants } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const inputClass = style({
  padding: '10px',
  fontSize: '16px',
  border: `1px solid ${colors.gray_scale[400]}`,
  borderRadius: '12px'
});

export const inputSizeClass = styleVariants({
  defaultValue: {
    width: '100%',
    height: '100%'
  },
  small: {},
  medium: {
    width: '100%',
    height: '57px'
  },
  large: {}
});
