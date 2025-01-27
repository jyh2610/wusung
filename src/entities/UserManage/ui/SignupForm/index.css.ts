import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { colors } from '@/design-tokens';

export const inputContainer = style({
  backgroundColor: colors.gray_scale['default'],
  boxShadow: 'rgba(90, 79, 45, 0.02)',
  borderRadius: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: '80px'
});

export const inputHeight = style({
  width: '100%',
  height: '57px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '40px'
});

export const labelContainer = style({
  width: '176px',
  fontSize: '28px',
  fontWeight: '500',
  lineHeight: '33.41px',
  color: colors.gray_scale[800]
});

export const starSpan = style({
  color: colors.brand[400]
});

export const buttonContainer = style({
  width: '240px',
  height: '56px',
  borderRadius: '12px',
  margin: '40px auto 0 auto'
});

export const subButton = style({
  width: '146px',
  height: '56px'
});
