import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const storyHeaderStyles = style({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center'
});

export const storyHeaderTextStyles = style({
  color: colors.brand[500],
  fontWeight: 500,
  fontSize: '32px',
  lineHeight: '48px'
});

export const storyHeaderContentStyles = style({
  paddingTop: '16px',
  fontWeight: 600,
  fontSize: '60px',
  letterSpacing: '-2.5%',
  lineHeight: '71.6px',
  color: colors.gray_scale[900]
});
