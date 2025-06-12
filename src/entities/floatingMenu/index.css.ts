import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  width: '360px',
  height: '405px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

export const header = style({
  fontSize: '24px',
  lineHeight: '28.64px',
  letterSpacing: '-2.5%',
  fontWeight: 500,
  color: colors.gray_scale[900]
});

export const headerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

export const listContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: '28.64px',
  letterSpacing: '-2.5%'
});

export const listItem = style({
  listStyle: 'none',
  cursor: 'pointer',
  color: colors.gray_scale[800], // 기본 색상
  transition: 'color 0.3s ease-in-out' // 부드러운 색상 변경
});

export const selectedItem = style({
  color: colors.brand[500] // 선택된 아이템의 색상
});

export const infoContainer = style({
  backgroundColor: colors.brand['0'],
  border: `1px solid ${colors.brand[100]}`,
  borderRadius: '16px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px'
});

export const infoTitle = style({
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

export const infoText = style({
  color: colors.gray_scale[800],
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '23.87px',
  letterSpacing: '-2.5%'
});

export const infoTextBody = style({
  color: colors.gray_scale[600],
  fontSize: '18px',
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  fontWeight: 400
});

export const infoBodyCall = style({
  display: 'flex',
  gap: '8px',
  color: colors.brand[500],
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '23.87px',
  letterSpacing: '-2.5%'
});

export const infoBodyLocation = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  color: colors.gray_scale[600],
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '22px',
  letterSpacing: '-2.5%',
  whiteSpace: 'nowrap'
});
