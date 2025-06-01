// styles/paymentHistory.css.ts
import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';
import { recipe } from '@vanilla-extract/recipes';

export const container = style({
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  borderRadius: '20px'
});

export const header = style({
  padding: '40px',
  backgroundColor: colors.gray_scale.default,
  borderRadius: '20px',
  color: colors.gray_scale[900],
  fontSize: '32px',
  fontWeight: '600',
  lineHeight: '32px'
});

// 버튼 기본 스타일
export const paymentBtn = style({
  width: '213.5px',
  height: '56px',
  border: `1px solid ${colors.gray_scale[600]}`, // 기본 테두리 색
  borderRadius: '200px',
  padding: '10px 20px',
  color: colors.gray_scale[600], // 기본 글자 색
  backgroundColor: 'transparent', // 기본 배경색
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '20px',
  fontWeight: '500',
  letterSpacing: '-2.5%',
  lineHeight: '100%'
});

// 선택된 버튼 스타일
export const selectedPaymentBtn = style({
  border: `1px solid ${colors.brand[400]}`, // 선택된 테두리 색
  color: colors.brand[400] // 선택된 글자 색
});

export const list = style({
  backgroundColor: colors.gray_scale.default,
  borderRadius: '20px',
  padding: '40px'
  // maxHeight: '1000px',
  // overflowY: 'auto', // 수직 스크롤만 필요하다면 overflowY 사용

  // selectors: {
  //   '&::-webkit-scrollbar': {
  //     display: 'none' // 또는 width: '0px' / height: '0px'
  //   }
  // },

  // scrollbarWidth: 'none',

  // msOverflowStyle: 'none'
});

export const listDate = style({
  fontSize: '24px',
  fontWeight: 500,
  letterSpacing: '-2.5%',
  color: colors.gray_scale[900],
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const label = style({
  padding: '8px 12px',
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  backgroundColor: colors.gray_scale['200'],
  color: colors.gray_scale[600],
  borderRadius: '8px'
});

export const paymentText = style({
  color: colors.gray_scale[600],
  backgroundColor: colors.gray_scale['200']
});

export const completeText = style({
  color: colors.brand[400],
  backgroundColor: colors.brand['0']
});

export const paymentContent = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const month = style({
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[800]
});

export const payPerMonth = style({
  fontSize: '32px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[800]
});

export const currency = style({
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '-2.5%',
  color: colors.gray_scale[600],
  marginLeft: '7px'
});

export const tableContainer = style({
  padding: '40px 40px 32px 40px',
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '20px',
  marginTop: '20px'
});

export const tableStyle = style({
  width: '100%',
  borderCollapse: 'collapse'
});

export const trStyle = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr', // 2:1:1 비율 설정
  width: '100%',
  cursor: 'pointer'
});

export const thStyle = style({
  padding: '10px',
  textAlign: 'center',
  color: colors.gray_scale[500],
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '25px',
  letterSpacing: '-2.5%'
});

export const tdStyle = style({
  padding: '8px 12px',
  textAlign: 'center',
  width: '100%',
  borderBottom: `1px solid ${colors.gray_scale[200]}`,
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '25px',
  letterSpacing: '-2.5%',
  display: 'flex',
  alignItems: 'center'
});

// 배경색 조건부 스타일
export const beforeStyle = style({
  width: '96px',
  height: '41px',
  backgroundColor: colors.gray_scale['100'], // 짝수 줄 배경색
  color: colors.gray_scale['600'],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  margin: 'auto'
});

export const completeRowStyle = style({
  width: '96px',
  height: '41px',
  backgroundColor: colors.brand['0'], // 홀수 줄 배경색
  color: colors.brand[400],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  margin: 'auto'
});

export const tdTitle = style({
  padding: '10px',
  textAlign: 'left'
});

export const date = style({
  display: 'flex',
  justifyContent: 'center'
});

export const refundBtn = recipe({
  base: {
    width: '100%',
    height: '56px',
    borderRadius: '12px',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '20px',
    fontWeight: '500',
    letterSpacing: '-2.5%',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  variants: {
    status: {
      refundable: {
        backgroundColor: 'transparent',
        border: `1px solid ${colors.brand[400]}`,
        color: colors.brand[600]
      },
      cancelable: {
        backgroundColor: '#FFEBEB',
        color: '#F22B2B'
      },
      refunded: {
        border: `1px solid ${colors.gray_scale['400']}`,
        color: colors.gray_scale[600]
      },
      paid: {
        border: `1px solid ${colors.gray_scale['400']}`,
        color: colors.gray_scale[600]
      }
    }
  },
  defaultVariants: {
    status: 'refundable'
  }
});

export const statusText = recipe({
  base: {
    width: '90px',
    height: '41px',
    fontSize: '18px',
    fontWeight: '500',
    letterSpacing: '-2.5%',
    lineHeight: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px'
  },
  variants: {
    status: {
      refundable: {
        color: '#F22B2B',
        backgroundColor: '#FFEBEB'
      },
      cancelable: {
        color: colors.brand[400],
        backgroundColor: colors.brand[0]
      },
      refunded: {
        color: '#F22B2B',
        backgroundColor: '#FFEBEB'
      },
      paid: {
        color: colors.gray_scale[600],
        backgroundColor: colors.gray_scale[100]
      },
      disabled: {
        color: colors.gray_scale[600],
        backgroundColor: colors.gray_scale[100]
      }
    }
  },
  defaultVariants: {
    status: 'disabled'
  }
});

export const emptyStyle = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '400px',
  padding: '40px 0',
  color: '#888'
});
export const receipt = style({
  width: '100%',
  height: '56px',
  borderRadius: '12px',
  padding: '10px 20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '20px',
  fontWeight: '500',
  letterSpacing: '-2.5%',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.brand[600],
  border: `1px solid ${colors.brand['400']}`
});
