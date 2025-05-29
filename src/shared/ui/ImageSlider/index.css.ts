import { style } from '@vanilla-extract/css';

export const sliderWrapper = style({
  overflow: 'hidden',
  width: '600px',
  height: '400px'
});

export const slider = style({
  display: 'flex',
  transition: 'transform 0.3s ease-in-out'
});

export const slideImg = style({
  width: '600px',
  height: '400px',
  flexShrink: 0
});
