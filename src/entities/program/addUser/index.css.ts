// AddUser.css.ts
import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const modalStyle = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '860px',
  backgroundColor: '#FFFFFF',
  borderRadius: '40px',
  boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.1)',
  padding: '60px'
});

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '40px',
  marginBottom: '24px',
  width: '100%'
});

export const labelStyle = style({
  width: '176px',
  fontWeight: 500
});

export const inputWrapperStyle = style({
  flex: 1,
  height: '57px'
});

export const dateGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap'
});

export const dateItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
});

export const select128 = style({
  width: '128px',
  height: '56px'
});

export const select200 = style({
  width: '200px',
  height: '56px'
});

export const starSpan = style({
  color: colors.brand[400]
});
