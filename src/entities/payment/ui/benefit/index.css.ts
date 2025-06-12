import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px'
});

export const cardContainer = style({
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '12px',
  width: '288px',
  height: '161px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '15px',
  padding: '0 20px'
});

export const cardHeader = style({
  color: colors.brand['300'],
  fontSize: '18px',
  fontWeight: '500',
  lineHeight: '25px',
  letterSpacing: '-2.5%'
});

export const cardContent = style({
  color: colors.gray_scale[800],
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '22px',
  letterSpacing: '-2.5%'
});

export const warning = style({
  color: '#FF5154',
  fontSize: '13px',
  fontWeight: '400',
  lineHeight: '22px',
  letterSpacing: '-2.5%',
  marginTop: '4px'
});
