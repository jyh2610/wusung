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
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '16px',
  marginTop: '16px'
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
  maxWidth: '140px',
  overflow: 'hidden',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  textOverflow: 'ellipsis'
});

export const thumbnailPopup = style({
  position: 'absolute',
  top: '50%',
  right: '105%',
  transform: 'translateY(-50%)',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  padding: '4px',
  borderRadius: '8px',
  width: '150px',
  height: '250px',
  zIndex: 1300
});

export const thumbnailPopupLeft = style({
  position: 'absolute',
  top: '50%',
  left: '105%',
  transform: 'translateY(-50%)',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  padding: '4px',
  borderRadius: '8px',
  width: '150px',
  height: '250px',
  zIndex: 1300
});

export const container = style({
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '20px',
  padding: '24px'
});

export const activityCardContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '16px'
});

export const activityCard = style({
  backgroundColor: colors.gray_scale['default'],
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  boxSizing: 'border-box',
  textAlign: 'center',
  height: '421px',
  border: `1px solid ${colors.gray_scale[200]}`,
  cursor: 'pointer'
});

// 모달 관련 스타일
export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
});

export const modalContent = style({
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '600px',
  maxHeight: '80vh',
  overflowY: 'auto'
});

export const modalHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
});

export const modalTitle = style({
  margin: 0
});

export const modalCloseButton = style({
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: colors.gray_scale[500]
});

export const modalBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});

export const selectedActivityItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  border: '1px solid #eee',
  borderRadius: '4px'
});

export const selectedActivityInfo = style({
  display: 'flex',
  gap: '12px',
  alignItems: 'center'
});

export const selectedActivityThumbnail = style({
  width: '60px',
  height: '60px',
  position: 'relative',
  borderRadius: '4px',
  overflow: 'hidden'
});

export const selectedActivityTitle = style({
  fontWeight: 'bold'
});

export const selectedActivityId = style({
  color: colors.gray_scale[500],
  fontSize: '14px'
});

export const removeActivityButton = style({
  background: 'none',
  border: 'none',
  color: colors.gray_scale[500],
  cursor: 'pointer',
  padding: '8px'
});

// 상단 컨테이너 스타일
export const topContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const categorySection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});

export const categoryTitle = style({
  fontSize: '32px',
  fontWeight: 600,
  color: colors.gray_scale[900],
  marginBottom: '8px'
});

export const buttonGroup = style({
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
});

export const buttonWrapper = style({
  width: '150px',
  height: '56px'
});

export const buttonWrapperSmall = style({
  width: '113px',
  height: '56px'
});

export const buttonWrapperMedium = style({
  width: '160px',
  height: '56px'
});

// 난이도 섹션
export const difficultySection = style({
  display: 'flex',
  gap: '8px',
  marginTop: '12px'
});

// 활동 리스트 섹션
export const activityListSection = style({
  marginTop: '20px'
});

export const emptyState = style({
  marginTop: '24px',
  textAlign: 'center',
  color: colors.gray_scale[500]
});

// 활동 카드 내부 스타일
export const activityCardHeader = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const activityCardInfo = style({
  display: 'flex',
  gap: '8px'
});

export const activityCardThumbnail = style({
  maxWidth: '256px',
  height: '357px',
  position: 'relative'
});

// Cascader 하이라이트 스타일
export const cascaderHighlight = style({
  border: `2px solid ${colors.brand[500]} !important`,
  boxShadow: `0 0 0 1px ${colors.brand[300]}`,
  borderRadius: '8px'
});
