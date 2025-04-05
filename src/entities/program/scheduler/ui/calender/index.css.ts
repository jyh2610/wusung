import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  marginTop: '2rem'
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr repeat(7, 1fr)', // 주차 1칸 + 요일 7칸
  textAlign: 'center',
  borderBottom: `1px solid ${colors.gray_scale[300]}`
});

export const weekDay = style({
  padding: '3px 0',
  maxHeight: '28px',
  borderTop: `1px solid ${colors.gray_scale[300]}`
});
export const weekLabelBg = style({
  backgroundColor: colors.gray_scale[200]
});
export const weekgridItem = style({
  padding: '0 12px',
  textAlign: 'center',
  borderRight: `1px solid ${colors.gray_scale[300]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const gridItem = style({
  padding: '0 12px',
  textAlign: 'center',
  borderRight: `1px solid ${colors.gray_scale[300]}`,
  minHeight: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const weekLabel = style({
  fontWeight: 'bold',
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
  color: '#F42E2E'
});

export const blueText = style({
  color: '#5457FF'
});

export const activityRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr repeat(7, 1fr)', // 주차 1칸 + 요일 7칸
  borderBottom: `1px solid ${colors.gray_scale[300]}`
});

export const activityCell = style({
  padding: '0.5rem',
  textAlign: 'center',
  borderRight: `1px solid ${colors.gray_scale[300]}`,
  minHeight: '62px' // 모든 칸 높이 동일하게 설정
});

export const activityLabel = style({
  fontWeight: 'bold'
});

export const activityListContainer = style({
  overflowY: 'auto',
  maxHeight: '1450px'
});
