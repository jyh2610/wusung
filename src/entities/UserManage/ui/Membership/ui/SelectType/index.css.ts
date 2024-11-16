import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const selectTypeStyle = style({
  width: '490px',
  height: '180px',
  backgroundColor: colors.gray_scale['default'],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '33.5px',
  borderRadius: '40px',
  backgroundClip: 'white'
});
