import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const smallBoxContainer = style({
  height: '374px',
  borderRadius: '20px',
  padding: '48px 0',
  backgroundColor: colors.gray_scale['default']
});

export const iconContainer = style({
  position: 'relative',
  width: '60px',
  height: '60px',
  margin: '0 auto'
});

export const contentContainer = style({
  margin: '40px 0'
});

export const title = style({
  fontSize: '32px',
  fontWeight: '500',
  lineHeight: '38.19px',
  textAlign: 'center'
});

export const content = style({
  fontSize: '24px',
  fontWeight: '400',
  lineHeight: '40px',
  color: colors.gray_scale['700'],
  letterSpacing: '-2.5%',
  textAlign: 'center',
  marginTop: '40px',
  whiteSpace: 'pre-wrap'
});
