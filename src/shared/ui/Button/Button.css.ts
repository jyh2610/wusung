import { style, styleVariants } from '@vanilla-extract/css';
import { colors } from '@/design-tokens/colors';

export const buttonBase = style({
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 40px',
  fontSize: '18px',
  fontWeight: '500',
  lineHeight: '25px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'inline-block'
});

export const buttonVariants = styleVariants({
  default: {
    backgroundColor: colors.gray_scale['default'],
    color: colors.gray_scale['default']
  },
  brand: {
    backgroundColor: colors.brand['400'],
    color: colors.brand[0]
  }
});
