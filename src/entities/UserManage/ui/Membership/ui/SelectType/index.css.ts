import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const selectTypeStyle = style({
  width: '490px',
  height: '180px',
  backgroundColor: colors.gray_scale['default'],
  border: '1px solid transparent',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '33.5px',
  borderRadius: '40px',
  backgroundClip: 'white'
});

export const selectedStyle = style({
  backgroundColor: colors.brand['0'],
  border: '1px solid #E33A9F',
  color: colors.brand[500],
  cursor: 'pointer'
});
