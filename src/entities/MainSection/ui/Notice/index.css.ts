import { style } from '@vanilla-extract/css';

export const noticeContainer = style({
  margin: '160px auto 0 auto',
  maxWidth: '1360px'
});

export const noticeContents = style({
  marginTop: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});
