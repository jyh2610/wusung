import { style } from '@vanilla-extract/css';

export const title = style({
  fontSize: '32px',
  fontWeight: '600'
});

export const titleContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '250px',
  marginBottom: '20px'
});
