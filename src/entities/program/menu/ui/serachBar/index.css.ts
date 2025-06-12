import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});

export const searchInput = style({
  padding: '16px 40px 16px 16px', // 오른쪽 공간 확보
  border: '1px solid #ccc',
  borderRadius: '12px',
  fontSize: '16px'
});
