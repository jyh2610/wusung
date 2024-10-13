import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const LineBannerContentStyles = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: colors.gray_scale[800],
  fontWeight: 500,
  fontSize: '32px',
  lineHeight: '38.19px',
  textAlign: 'center'
});

export const contentStyles = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  selectors: {
    '&:hover': {
      cursor: 'pointer',
      color: colors.brand[400]
    }
  }
});
