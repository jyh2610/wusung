import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const footerStyle = style({
  width: '100%',
  backgroundColor: colors.gray_scale[200],
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '22px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[700],
  // position: 'absolute',
  bottom: '0'
});

export const footerContentStyle = style({
  marginLeft: '280px',
  paddingTop: '40px',
  paddingBottom: '40px',

  '@media': {
    '(max-width: 1024px)': {
      paddingTop: '10px',
      paddingBottom: '10px'
    }
  }
});
