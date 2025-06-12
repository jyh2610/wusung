import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const bigBoxContainer = style({
  height: '374px',
  borderRadius: '20px',
  padding: '48px 40px',
  backgroundColor: colors.gray_scale['default']
});

export const iconContainer = style({
  position: 'relative',
  width: '60px',
  height: '60px',
  margin: '0 auto'
});

export const contentContainer = style({
  margin: '40px'
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
  textAlign: 'center',
  marginTop: '40px',
  whiteSpace: 'pre-wrap',
  letterSpacing: '-2.5%'
});

export const subContent = style({
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '25px',
  color: colors.gray_scale['700'],
  textAlign: 'center'
});
