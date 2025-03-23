import { style } from '@vanilla-extract/css';

export const layoutContainer = style({
  width: '100%',
  minHeight: 'calc(100vh - 303px)',
  display: 'flex',
  justifyContent: 'center',
  gap: '112px',
  paddingTop: '60px',
  marginBottom: '310px'
});
