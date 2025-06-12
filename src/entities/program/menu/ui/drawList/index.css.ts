import { style, globalStyle } from '@vanilla-extract/css';

export const useBoxContainer = style({
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  height: '450px',
  overflowY: 'auto'
});

globalStyle(`${useBoxContainer}::-webkit-scrollbar`, {
  width: '3px'
});

globalStyle(`${useBoxContainer}::-webkit-scrollbar-track`, {
  background: '#f1f1f1',
  borderRadius: '10px'
});

globalStyle(`${useBoxContainer}::-webkit-scrollbar-thumb`, {
  background: '#888',
  borderRadius: '10px'
});

globalStyle(`${useBoxContainer}::-webkit-scrollbar-thumb:hover`, {
  background: '#555'
});
