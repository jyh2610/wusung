import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const inputContainer = style({ padding: '80px 0' });

export const title = style({
  fontSize: '48px',
  fontWeight: '600',
  lineHeight: '57.28px',
  textAlign: 'center',
  color: colors.gray_scale[900]
});

export const subTitle = style({
  fontSize: '24px',
  fontWeight: 400,
  lineHeight: '40px',
  letterSpacing: '-2.5%',
  textAlign: 'center',
  color: colors.gray_scale[800]
});

export const info = style({
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[700]
});
