import { style } from '@vanilla-extract/css';

export const container = style({
  marginTop: '2rem'
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr repeat(7, 1fr)', // 주차 1칸 + 요일 7칸
  textAlign: 'center',
  padding: '0.5rem 0',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f9fafb'
});

export const gridItem = style({
  padding: '0.5rem',
  textAlign: 'center',
  borderRight: '1px solid #ddd',
  minHeight: '50px' // 모든 칸 높이 통일
});

export const weekLabel = style({
  fontWeight: 'bold',
  backgroundColor: '#e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const highlighted = style({
  backgroundColor: '#ffd6e7',
  borderRadius: '9999px',
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto'
});

export const redText = style({
  color: '#ec008c'
});

export const blueText = style({
  color: '#1e3a8a'
});

export const activityRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr repeat(7, 1fr)', // 주차 1칸 + 요일 7칸
  borderBottom: '1px solid #ddd',
  backgroundColor: '#fff'
});

export const activityCell = style({
  padding: '0.5rem',
  textAlign: 'center',
  borderRight: '1px solid #ddd',
  minHeight: '50px' // 모든 칸 높이 동일하게 설정
});

export const activityLabel = style({
  fontWeight: 'bold',
  backgroundColor: '#f9fafb'
});
