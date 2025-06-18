import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { colors } from '@/design-tokens';

export const container = style({
  padding: '24px',
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '22px'
});

export const titleContainer = style({
  display: 'flex',
  gap: '24px',
  alignItems: 'center'
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

export const header = style({
  fontSize: '24px',
  fontWeight: '600',
  marginBottom: '24px',
  color: '#333',
  padding: '16px 0',
  borderBottom: '2px solid #eee'
});

export const paginationContainer = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px'
});

// Cascader 하이라이트 스타일
export const cascaderHighlight = style({
  border: `2px solid ${colors.brand[500]} !important`,
  boxShadow: `0 0 0 1px ${colors.brand[300]}`,
  borderRadius: '8px'
});
