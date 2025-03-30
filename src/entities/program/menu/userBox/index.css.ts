import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  color: colors.gray_scale[800],
  border: `1px solid ${colors.gray_scale[200]}`,
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '12px',
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

export const title = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const imgContainer = style({
  display: 'flex',
  gap: '6px'
});

export const imgBox = style({
  position: 'relative',
  width: '20px',
  height: '20px'
});

// 👉 추가된 스타일 (기존 인라인 스타일 변환)
export const userInfo = style({
  display: 'flex',
  gap: '4px'
});

export const userNumber = style({
  width: '20px',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '22px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[500]
});

export const userName = style({
  fontSize: '20px',
  fontWeight: '500',
  lineHeight: '100%',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[800]
});

export const roleBox = style({
  display: 'flex',
  gap: '4px'
});
export const selectedOptIcon = style({
  filter:
    'grayscale(100%) brightness(0) sepia(100%) hue-rotate(-50deg) saturate(500%)' // 👈 선택 시 색 변경 (brand[400] 색상)
});
export const selectedContainer = style({
  border: `1px solid ${colors.brand[300]}`, // 선택 시 보더 변경
  backgroundColor: colors.brand[0] // 선택 시 배경 변경
});

export const selectedOptContainer = style({
  backgroundColor: colors.brand[0], // 선택 시 배경 변경
  color: colors.brand[0] //
});
