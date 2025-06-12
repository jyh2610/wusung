import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const controlContainer = style({
  display: 'flex',
  gap: '8px'
});
export const Container = style({
  marginTop: '12px',
  display: 'flex',
  justifyContent: 'space-between'
});
export const buttonStyle = style({
  padding: '12px 20px',
  border: `1px solid ${colors.brand[400]}`,
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '12px',
  color: colors.brand[300],
  fontSize: '20px',
  fontWeight: 500,
  letterSpacing: '-2.5%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px'
});
export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999
});

export const modalContent = style({
  background: '#fff',
  borderRadius: '12px',
  padding: '24px',
  width: '420px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
});

export const closeButton = style({
  position: 'absolute',
  top: '16px',
  right: '16px',
  border: 'none',
  background: 'none',
  fontSize: '16px',
  cursor: 'pointer'
});

export const filterSection = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '16px',
  alignItems: 'center'
});

export const planList = style({
  listStyle: 'none',
  padding: 0,
  margin: '16px 0',
  maxHeight: '240px',
  overflowY: 'auto'
});

export const planItem = style({
  padding: '10px',
  marginBottom: '6px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: '#f0f0f0'
    },
    '&.selected': {
      backgroundColor: '#e6f0ff',
      borderColor: '#1e90ff'
    }
  }
});

export const confirmButtonWrapper = style({
  marginTop: '20px',
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  width: '150px',
  height: '46px'
});

export const additionalData = style({
  display: 'flex',
  gap: '12px'
});
