// features/activity/ui/Activity.css.ts
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '24px'
});

export const titleContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const activityCardContainer = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginTop: '20px'
});

export const activityCard = style({
  border: '1px solid #e0e0e0',
  padding: '12px',
  borderRadius: '8px',
  width: '256px'
});
