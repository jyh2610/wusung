import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const listContainer = style({
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column'
});

export const listBox = style({
  width: '800px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '69px',
  borderBottom: '1px solid transparent',
  selectors: {
    '&:hover': {
      cursor: 'pointer',
      borderBottom: `1px solid ${colors.brand[500]}`
    }
  }
});

export const content = style({
  fontSize: '25px',
  lineHeight: '28.64px',
  letterSpacing: '-2.5%',
  fontWeight: '500',
  color: colors.gray_scale[800]
});

export const date = style({
  fontSize: '18px',
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  fontWeight: '400',
  color: colors.gray_scale[600]
});
