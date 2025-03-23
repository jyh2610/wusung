import { style } from '@vanilla-extract/css';

export const container = style({
  marginTop: '2rem'
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem'
});

export const monthTitle = style({
  fontSize: '1.25rem',
  fontWeight: '500'
});

export const button = style({
  backgroundColor: '#ec008c',
  color: 'white',
  borderRadius: '0.375rem',
  padding: '0.5rem 1rem',
  ':hover': {
    backgroundColor: '#d0007a'
  }
});

export const buttonOutline = style({
  border: '1px solid #ec008c',
  color: '#ec008c',
  borderRadius: '9999px',
  padding: '0.5rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.875rem'
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  textAlign: 'center',
  padding: '0.5rem 0',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f9fafb'
});

export const gridItem = style({
  padding: '0.5rem',
  textAlign: 'center',
  borderRight: '1px solid #ddd'
});

export const weekLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem'
});

export const highlighted = style({
  backgroundColor: '#ffd6e7',
  borderRadius: '9999px',
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 'auto',
  marginRight: 'auto'
});

export const redText = style({
  color: '#ec008c'
});

export const blueText = style({
  color: '#1e3a8a'
});

export const activityRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  borderBottom: '1px solid #ddd'
});

export const activityCell = style({
  padding: '0.5rem',
  textAlign: 'center',
  borderRight: '1px solid #ddd'
});

export const activityLabel = style({
  backgroundColor: '#f9fafb'
});
