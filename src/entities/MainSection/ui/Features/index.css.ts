import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const sectionContainer = style({
  width: '100vw',
  backgroundColor: '#D8D8D8',
  marginTop: '160px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '120px 0'
});
export const featuresContainer = style({
  maxWidth: '1360px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

export const headerContainer = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: '16px',
  marginBottom: '92px'
});
export const headerTitle = style({
  color: colors.brand[500],
  fontWeight: 500,
  fontSize: '32px',
  lineHeight: '48px',
  fontFamily: 'sans-serif'
});
export const headerContent = style({
  color: colors.gray_scale[900],
  fontSize: '48px',
  lineHeight: '57.28px',
  fontWeight: '600'
});

export const boxContainer = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px'
});

export const bigBoxContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '40px'
});

export const smallBoxContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '40px'
});
