// src/app/(with-nav)/payment/paymentPage.css.ts (예시 경로)
import { colors } from '@/design-tokens';
import { style, globalStyle, keyframes } from '@vanilla-extract/css';

/* 기본 스타일 리셋 */
globalStyle('*', {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box'
});

/* 컨테이너 스타일 */
export const container = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

/* 카드 스타일 */
export const card = style({
  width: '500px',
  borderRadius: '8px',
  overflow: 'hidden'
});
export const productSummaryContainer = style({
  marginBottom: '24px', // 폼과의 간격
  paddingBottom: '20px', // 아래쪽에 패딩
  borderBottom: '1px solid #eee' // 구분선
});

export const productNameStyle = style({
  fontSize: '18px',
  fontWeight: 600,
  color: '#333',
  marginBottom: '8px'
});

export const priceStyle = style({
  fontSize: '20px',
  fontWeight: 700,
  color: colors.brand[400] // 예시 강조 색상
});
export const cardHeader = style({
  padding: '24px',
  borderBottom: '1px solid #eaeaea'
});

export const cardTitle = style({
  fontSize: '24px',
  fontWeight: 600,
  color: '#333',
  marginBottom: '8px'
});

export const cardDescription = style({
  fontSize: '14px',
  color: '#666'
});

export const cardContent = style({
  padding: '24px'
});

export const cardFooter = style({
  padding: '16px 24px',
  borderTop: '1px solid #eaeaea',
  textAlign: 'center',
  fontSize: '12px',
  color: '#666'
});

/* 폼 스타일 */
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
});

export const label = style({
  fontSize: '14px',
  fontWeight: 500,
  color: '#333'
});

export const input = style({
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  transition: 'border-color 0.2s',
  selectors: {
    '&:focus': {
      outline: 'none',
      borderColor: '#4f46e5',
      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.1)'
    },
    '&::placeholder': {
      color: '#aaa'
    }
  }
});

export const errorMessage = style({
  fontSize: '12px',
  color: '#e11d48',
  marginTop: '4px'
});

/* 라디오 버튼 스타일 */
export const radioGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginTop: '6px'
});

export const radioItem = style({
  display: 'flex',
  alignItems: 'center'
});

// 라디오 input 자체는 숨기고 label을 스타일링
export const radioInput = style({
  position: 'absolute',
  opacity: 0,
  width: 0,
  height: 0
});

export const radioLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  width: '100%',
  cursor: 'pointer',
  transition: 'all 0.2s',
  selectors: {
    // radioInput이 체크되었을 때 다음 형제인 radioLabel 스타일 변경
    [`${radioInput}:checked + &`]: {
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.05)'
    }
  }
});

export const radioIcon = style({
  fontSize: '16px'
});

/* 버튼 스타일 */
export const button = style({
  marginTop: '10px',
  padding: '12px',
  backgroundColor: colors.brand[400],
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  selectors: {
    '&:hover': {
      backgroundColor: '#4338ca'
    },
    '&:disabled': {
      backgroundColor: '#a5a5a5',
      cursor: 'not-allowed'
    }
  }
});

/* 토스트 메시지 스타일 */
export const slideIn = keyframes({
  from: {
    transform: 'translateX(100%)',
    opacity: 0
  },
  to: {
    transform: 'translateX(0)',
    opacity: 1
  }
});

export const toast = style({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  padding: '16px',
  maxWidth: '350px',
  zIndex: 1000,
  animation: `${slideIn} 0.3s ease-out` // keyframes 애니메이션 적용
});

export const toastContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
});

export const toastTitle = style({
  fontSize: '16px',
  fontWeight: 600,
  color: '#333'
});

export const toastDescription = style({
  fontSize: '14px',
  color: '#666'
});

/* 반응형 스타일 */
// 특정 스타일(들) 안에 '@media' 속성으로 반응형 스타일 정의
export const cardHeaderResponsive = style({
  '@media': {
    '(max-width: 480px)': {
      padding: '16px'
    }
  }
});

export const cardContentResponsive = style({
  '@media': {
    '(max-width: 480px)': {
      padding: '16px'
    }
  }
});

export const cardTitleResponsive = style({
  '@media': {
    '(max-width: 480px)': {
      fontSize: '20px'
    }
  }
});

export const buttonResponsive = style({
  '@media': {
    '(max-width: 480px)': {
      padding: '10px'
    }
  }
});

// Note: 여러 개의 반응형 스타일을 하나의 요소에 적용할 수 있습니다.
// 예: <div className={`${cardHeader} ${cardHeaderResponsive}`}>

const spacing = (units: number) => `${units * 0.25}rem`;

export const completeModalContent = style({
  // 이 스타일은 모달 내용 자체의 컨테이너에 적용됩니다.
  // 모달 배경/중앙 정렬 스타일은 MUI Modal wrapper 등에서 담당합니다.
  backgroundColor: 'white', // 배경색
  padding: spacing(6), // 내부 여백 (24px)
  borderRadius: '8px', // 모서리 둥글게
  maxWidth: '500px', // 최대 너비
  width: '100%', // 너비
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // 그림자
  display: 'flex', // 내부 요소 정렬을 위해 flex 사용
  flexDirection: 'column', // 컬럼 방향 정렬
  gap: spacing(4) // 내부 요소 간 간격 (16px)
});

export const completeTitle = style({
  fontSize: '28px', // 제목 크기
  fontWeight: 700, // 두껍게
  color: '#333', // 글자색
  textAlign: 'center', // 중앙 정렬
  marginBottom: spacing(4) // 제목 아래 여백
});

export const dataSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing(2), // 데이터 항목 간 간격 (8px)
  borderBottom: '1px solid #eee', // 섹션 구분선
  paddingBottom: spacing(3) // 구분선 아래 여백
});

export const lastDataSection = style([
  dataSection,
  {
    borderBottom: 'none', // 마지막 섹션은 구분선 없음
    paddingBottom: 0
  }
]);

export const dataRow = style({
  display: 'flex',
  justifyContent: 'space-between', // 라벨과 값 사이 공간 분배
  alignItems: 'center' // 세로 중앙 정렬
});

export const dataLabel = style({
  fontSize: '16px',
  fontWeight: 500,
  color: '#555',
  flexShrink: 0, // 라벨이 줄어들지 않도록
  marginRight: spacing(2) // 라벨 오른쪽 여백
});

export const dataValue = style({
  fontSize: '16px',
  fontWeight: 600,
  color: '#333',
  textAlign: 'right', // 값을 오른쪽에 정렬
  wordBreak: 'break-word' // 긴 단어 줄바꿈
});

export const messageContainer = style({
  fontSize: '15px',
  color: '#4f46e5', // 강조 색상 (예: 브랜드 색상)
  textAlign: 'center',
  padding: spacing(3),
  backgroundColor: '#eef2ff', // 연한 배경색
  borderRadius: '4px'
  // marginTop: spacing(3), // 위쪽 여백 (gap으로 대체될 수 있음)
});

export const receiptLink = style({
  display: 'block', // 블록 요소로 만들어 margin/padding 적용 용이
  textAlign: 'center', // 텍스트 중앙 정렬
  fontSize: '15px',
  color: '#007bff', // 링크 기본 색상
  textDecoration: 'underline', // 밑줄
  cursor: 'pointer',
  ':hover': {
    color: '#0056b3' // 호버 시 색상 변경
  }
  // marginTop: spacing(3), // 위쪽 여백 (gap으로 대체될 수 있음)
});

export const closeButton = style({
  // 이 버튼은 모달 내용 자체에 포함되는 '닫기' 버튼입니다.
  width: '100%', // 너비 가득 채우기
  padding: spacing(3), // 패딩
  backgroundColor: '#eee', // 배경색
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: spacing(3), // 위쪽 여백
  ':hover': {
    backgroundColor: '#ddd'
  }
});
