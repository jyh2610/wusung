import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  backgroundColor: colors.gray_scale.default,
  marginTop: '20px',
  marginBottom: '79px',
  borderRadius: '20px',
  padding: '20px 24px'
});
export const scrollHidden = style({
  overflowY: 'auto',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE, Edge

  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none' // Chrome, Safari
    }
  }
});
