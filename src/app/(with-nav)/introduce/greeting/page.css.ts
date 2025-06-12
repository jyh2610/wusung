import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '20px',
  padding: '40px 0',
  boxShadow: 'rgba(90, 79, 45, 0.02)',
  width: '928px',
  gap: '20px'
});

export const imgContainer = style({
  position: 'relative',
  padding: '0 , 45px',
  margin: '0 auto',
  width: '798px',
  height: '478px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const content = style({
  height: '325px',
  padding: '0 40px',
  paddingTop: '32px',
  color: colors.gray_scale[800],
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
});
