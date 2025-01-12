import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const footerStyle = style({
  width: '100%',
  height: '168px',
  backgroundColor: colors.gray_scale[200],
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '22px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[700],
  position: 'relative'
});

export const footerContentStyle = style({
  marginLeft: '280px',
  paddingTop: '40px'
});
