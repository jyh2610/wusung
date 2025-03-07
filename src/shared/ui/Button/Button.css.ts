import { style, styleVariants } from '@vanilla-extract/css';
import { colors } from '@/design-tokens/colors';

export const buttonBase = style({
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: '12px',
  // padding: '12px 40px',
  fontSize: '18px',
  fontWeight: '500',
  lineHeight: '25px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'inline-block'
});

export const borderButtonBase = style({
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  // padding: '12px 40px',
  fontSize: '18px',
  fontWeight: '500',
  lineHeight: '25px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'inline-block'
});
//'small' | 'medium' | 'large';
export const buttonVariants = styleVariants({
  default: {
    backgroundColor: 'transparent',
    color: colors.gray_scale['700']
  },
  beforeSelection: {
    backgroundColor: colors.gray_scale['500'],
    color: colors.brand['0']
  },
  brand: {
    backgroundColor: colors.brand['400'],
    color: colors.brand[0]
  },
  borderBrand: {
    border: `${colors.brand[400]} 1px solid`,
    color: colors.brand[400],
    backgroundColor: 'transparent'
  }
});
