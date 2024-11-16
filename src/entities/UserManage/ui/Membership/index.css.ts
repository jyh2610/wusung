import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const memberShipStyle = style({
  maxWidth: '1000px',
  margin: '0 auto'
});

export const titleStyle = style({
  fontSize: '48px',
  fontWeight: '600',
  lineHeight: '57.28px',
  textAlign: 'center',
  color: colors.gray_scale[900]
});

export const titleContentStyle = style({
  fontSize: '24px',
  fontWeight: '400',
  lineHeight: '40px',
  letterSpacing: '-2.5%',
  textAlign: 'center',
  color: colors.gray_scale[800]
});

export const selectContainerStyle = style({
  display: 'flex'
});
