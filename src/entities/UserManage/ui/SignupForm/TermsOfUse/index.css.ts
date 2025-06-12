import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const selectContainer = style({
  display: 'flex',
  gap: '60px'
});

export const labelContainer = style({
  width: '176px',
  fontSize: '28px',
  lineHeight: '33.41px'
});

export const selectBox = style({
  width: '604px',
  height: '56px',
  padding: '16px 20px',
  display: 'flex',
  color: colors.gray_scale[800],
  alignItems: 'center',
  gap: '10px',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '23.87px',
  letterSpacing: '-2.5%'
});

export const select = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '10px'
});

export const allAccepts = style({
  border: `1px solid ${colors.gray_scale[400]}`,
  borderRadius: '12px'
});

export const iconSize = style({
  width: '23.33px',
  height: '23.33px',
  position: 'relative'
});

export const lookAccept = style({
  display: 'flex',
  alignItems: 'center',
  color: colors.brand[500],
  cursor: 'pointer'
});
