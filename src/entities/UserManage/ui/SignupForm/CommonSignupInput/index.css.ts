import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { colors } from '@/design-tokens';

export const searchAddress = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px'
});

export const inputBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px'
});

export const emailBox = style({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  alignItems: 'center'
});

export const birthContainer = style({
  display: 'flex',
  gap: '40px'
});

export const birthBox = style({
  display: 'flex',
  gap: '12px',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const birthLabelBox = style({
  width: '176px',
  height: '45px',
  fontSize: '28px',
  fontWeight: '500',
  lineHeight: '33.41px',
  color: colors.gray_scale[800],
  margin: 'auto'
});

export const birthDropdown = style({
  width: '200px',
  height: '57px',
  fontSize: '18px',
  lineHeight: '18px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[700],
  margin: 'auto',
  borderRadius: '12px !important'
});

export const dropdownArrow = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center'
});
export const validateId = recipe({
  base: {
    width: '160px',
    height: '56px',
    fontSize: '20px',
    borderRadius: '12px',
    fontWeight: '500',
    letterSpacing: '-2.5%',
    lineHeight: '23.78px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  variants: {
    isActive: {
      true: {
        backgroundColor: 'rgba(238, 252, 242, 1)',
        color: 'rgba(26, 169, 62, 1)'
      },
      false: {
        backgroundColor: 'rgba(249, 235, 235, 1)',
        color: 'rgba(223, 35, 35, 1)'
      }
    }
  },
  defaultVariants: {
    isActive: false
  }
});
