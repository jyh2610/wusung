import { style } from '@vanilla-extract/css';

export const featuresContainer = style({
  width: '100%',
  backgroundColor: '#D8D8D8',
  marginTop: '160px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '120px 280px'
});

export const boxContainer = style({
  width: '1360px',
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
