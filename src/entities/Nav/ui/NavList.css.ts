import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const ListContainerStyle = style({});

export const listFontStyle = style({
  fontWeight: '500',
  fontSize: '32px',
  lineHeight: '38px',
  color: colors.gray_scale[800],
  textAlign: 'center',
  selectors: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
});
