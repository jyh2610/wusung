import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  border: `1px solid ${colors.brand[700]}`,
  borderRadius: '16px',
  padding: '80px 40px',
  backgroundColor: colors.brand[0],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});

export const title = style({
  textAlign: 'center',
  fontSize: '40px',
  fontWeight: '600',
  lineHeight: '47.73px',
  color: '#444444'
});

export const content = style({
  textAlign: 'center',
  fontSize: '18px',
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  color: '#636363',
  marginTop: '8px'
});

export const numberBox = style({
  color: '#D52990',
  fontSize: '32px',
  fontWeight: '500',
  lineHeight: '38.19px',
  marginTop: '41px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '7px'
});
