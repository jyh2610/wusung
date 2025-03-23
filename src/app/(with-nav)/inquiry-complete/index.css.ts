import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px'
});

export const imageContainer = style({
  width: '200px',
  height: '200px',
  position: 'relative'
});

export const title = style({
  color: colors.brand['500'],
  fontSize: '40px',
  fontWeight: '500',
  lineHeight: '40px',
  letterSpacing: '-2%',
  textAlign: 'center'
});

export const description = style({
  marginTop: '10px',
  fontWeight: '400',
  fontSize: '24px',
  lineHeight: '40px',
  letterSpacing: '-2.5%',
  textAlign: 'center'
});

export const btncontainer = style({
  display: 'flex',
  gap: '10px'
});

export const buttonStyle = style({
  width: '240px',
  height: '56px'
});
