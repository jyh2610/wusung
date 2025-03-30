import { createThemeContract, style, createTheme } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const container = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  marginTop: '12px',
  backgroundColor: colors.gray_scale['default'],
  padding: '40px',
  borderRadius: '12px'
});

export const head = style({
  fontSize: '20px',
  fontWeight: '500',
  lineHeight: '23.87px',
  letterSpacing: '-2.5%',
  color: colors.gray_scale['800'] // Default color
});

export const body = style({
  display: 'flex',
  justifyContent: 'space-between'
});

// 🔹 테마 계약 (border 색상과 head 및 paymentPrice 색상을 변경할 수 있도록 설정)
export const contentTheme = createThemeContract({
  borderColor: '--border-color',
  color: '--color',
  headColor: '--head-color', // Add head color to theme contract
  paymentPriceColor: '--payment-price-color' // Add payment price color to theme contract
});

// 🔹 기본 상태 (선택되지 않은 경우)
export const defaultTheme = createTheme(contentTheme, {
  borderColor: colors.gray_scale[400], // 기본 회색
  color: colors.brand[400],
  headColor: colors.gray_scale[800], // Default head color
  paymentPriceColor: colors.gray_scale[800] // Default paymentPrice color
});

// 🔹 선택된 상태 (선택된 경우)
export const selectedTheme = createTheme(contentTheme, {
  borderColor: colors.brand[400],
  color: colors.brand[400],
  headColor: colors.brand[400], // Selected head color
  paymentPriceColor: colors.brand[400] // Selected paymentPrice color
});

export const content = style({
  width: '262px',
  height: '126px',
  borderRadius: '12px',
  border: `1px solid ${contentTheme.borderColor}`,
  color: contentTheme.borderColor,
  padding: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer'
});

export const contentBody = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'center'
});

export const beforePrice = style({
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '22px',
  letterSpacing: '-2.5%',
  textDecoration: 'line-through',
  color: colors.gray_scale[400]
});

export const paymentPrice = style({
  fontSize: '28px',
  fontWeight: '500',
  lineHeight: '33.41px',
  color: contentTheme.paymentPriceColor // Apply dynamic color based on theme
});

export const price = style({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center'
});

// 🔹 PaymentMethod 테마 계약 (border 색상과 text 색상 변경 가능)
export const paymentMethodTheme = createThemeContract({
  borderColor: '--border-color',
  textColor: '--text-color'
});

// 🔹 기본 상태 (선택되지 않은 경우)
export const defaultPaymentTheme = createTheme(paymentMethodTheme, {
  borderColor: colors.gray_scale[400],
  textColor: colors.gray_scale[800]
});

// 🔹 선택된 상태 (선택된 경우)
export const selectedPaymentTheme = createTheme(paymentMethodTheme, {
  borderColor: colors.brand[400],
  textColor: colors.brand[400]
});

export const payment = style({
  width: '399px',
  height: '72px',
  border: `1px solid ${paymentMethodTheme.borderColor}`,
  color: paymentMethodTheme.textColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '12px'
});
