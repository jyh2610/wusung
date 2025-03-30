import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  width: '600px'
});

export const inputContainer = style({
  backgroundColor: colors.gray_scale['default'],
  padding: '60px 80px 48px 80px',
  boxShadow: 'rgba(90, 79, 45, 0.02)',
  borderRadius: '20px'
});

export const title = style({
  textAlign: 'center',
  marginBottom: '40px'
});
