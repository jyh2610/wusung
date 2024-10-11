import { style } from '@vanilla-extract/css';

// 모달 오버레이 스타일
export const overlayStyle = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경색 반투명
  zIndex: 50
});

// 모달 패널 스타일
export const panelStyle = style({
  width: '362px',
  height: '186px',
  maxWidth: '32rem', // 최대 너비 32rem (512px)
  padding: '3rem', // 내부 패딩
  backgroundColor: 'white', // 흰색 배경
  borderRadius: '0.5rem', // 모서리 둥글게
  border: '1px solid #e5e7eb', // 테두리 색상
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', // 그림자 효과
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem' // 요소 사이 간격
});
