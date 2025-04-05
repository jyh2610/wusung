import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { colors } from '@/design-tokens';

export const titleContainer = style({
  display: 'flex',
  gap: '24px',
  alignItems: 'center'
});

export const difficultyBox = recipe({
  base: {
    padding: '8px 16px',
    borderRadius: '22px',
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '25px',
    letterSpacing: '-2.5%',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    marginTop: '12px'
  },
  variants: {
    level: {
      high: {
        border: `1px solid ${colors.gray_scale[400]}`,
        color: colors.gray_scale[800]
      },
      medium: {
        border: `1px solid ${colors.gray_scale[400]}`,
        color: colors.gray_scale[800]
      },
      low: {
        border: `1px solid ${colors.gray_scale[400]}`,
        color: colors.gray_scale[800]
      }
    },
    selected: {
      true: {
        color: colors.brand[500],
        border: `1px solid ${colors.brand[300]}`
      },
      false: {}
    }
  },
  defaultVariants: {
    selected: false
  }
});
export const activityContainer = style({
  border: `1px solid ${colors.gray_scale[200]}`,
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  gap: '8px'
});

export const activityListContainer = style({
  display: 'grid', // ✅ Grid 레이아웃 사용
  gridTemplateColumns: 'repeat(5, 1fr)', // ✅ 한 줄에 5개
  gap: '16px', // ✅ 요소 사이 간격
  marginTop: '16px' // ✅ 상단 여백 추가
});

export const activityBox = style({
  border: `1px solid ${colors.gray_scale[200]}`,
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  gap: '8px',
  height: '54px',
  boxSizing: 'border-box'
});

export const activityNumber = style({
  fontSize: '14px',
  lineHeight: '22px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[500]
});

export const activityContent = style({
  fontSize: '16px',
  lineHeight: '22px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[800],
  maxWidth: '140px', // ✅ 글자가 넘치지 않도록 제한
  overflow: 'hidden', // ✅ 넘치는 텍스트 숨기기
  whiteSpace: 'normal', // ✅ 줄바꿈 허용
  wordBreak: 'break-word', // ✅ 단어가 길면 줄바꿈
  textOverflow: 'ellipsis' // ✅ 너무 길면 "..." 표시
});
export const thumbnailPopup = style({
  position: 'absolute',
  top: '50%',
  left: '105%',
  transform: 'translateY(-50%)',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  padding: '4px',
  borderRadius: '8px',
  width: '200px',
  height: '150px',
  zIndex: 10
});
