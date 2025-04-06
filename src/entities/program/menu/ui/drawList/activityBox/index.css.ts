import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

// 스타일 정의
export const listItem = style({
  padding: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: colors.gray_scale[700],
  fontSize: '20px',
  lineHeight: '100%',
  letterSpacing: '-2.5%',
  marginBottom: '8px'
});

export const selectedItem = style({
  color: colors.brand[500], // 선택된 항목의 글자색
  fontWeight: 'bold',
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '12px'
});
