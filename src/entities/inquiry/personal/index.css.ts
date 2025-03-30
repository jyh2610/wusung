// index.css.ts
import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

// 메인 컨텐츠 스타일
export const mainContent = style({
  flex: 1,
  backgroundColor: colors.gray_scale['default'],
  padding: '40px',
  borderRadius: '40px'
});

// 페이지 헤더
export const pageHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px'
});

export const pageTitle = style({
  fontSize: '48px',
  fontWeight: '600',
  lineHeight: '57.28px'
});

export const viewInquiriesBtn = style({
  width: '186px',
  height: '56px',
  backgroundColor: 'white',
  border: `1px solid ${colors.brand['400']}`,
  color: colors.brand['400'],
  padding: '8px 16px',
  borderRadius: '12px',
  fontSize: '20px',
  lineHeight: '23.87px',
  letterSpacing: '-2.5%',
  cursor: 'pointer'
});

// 폼 스타일
export const inquiryForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
});

export const formRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center'
});

export const formLabel = style({
  width: '96px',
  paddingTop: '8px',
  fontSize: '24px',
  lineHeight: '28.64px',
  letterSpacing: '-2.5%',
  fontWeight: '500',
  color: colors.gray_scale[800]
});

export const required = style({
  color: colors.brand['700']
});

export const formField = style({
  width: '200px',
  flex: 1
});

export const selectWrapper = style({
  position: 'relative'
});

export const formSelect = style({
  width: '200px',
  height: '57px',
  border: `1px solid ${colors.gray_scale['400']}`,
  borderRadius: '4px',
  padding: '8px 24px 8px 16px',
  backgroundColor: 'white'
});

export const formInput = style({
  width: '100%',
  height: '57px',
  border: `1px solid ${colors.gray_scale['400']}`,
  borderRadius: '4px',
  padding: '8px 16px'
});

export const formTextarea = style({
  width: '100%',
  border: `1px solid ${colors.gray_scale['400']}`,
  borderRadius: '4px',
  padding: '12px 16px',
  height: '400px',
  resize: 'none',
  fontSize: '14px'
});

export const charCount = style({
  textAlign: 'right',
  fontSize: '12px',
  color: colors.gray_scale['800'],
  marginTop: '4px'
});

// 파일 업로드 스타일
export const fileUploadArea = style({
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});

export const fileUploadBox = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '104px',
  height: '104px',
  backgroundColor: colors.gray_scale['default'],
  border: `1px solid ${colors.gray_scale['400']}`,
  borderRadius: '12px'
});

export const fileGuidelines = style({
  fontSize: '12px',
  color: colors.gray_scale['800'],
  marginLeft: '16px'
});

export const fileGuidelinesItem = style({
  marginBottom: '4px'
});

// 폼 제출 버튼
export const formSubmit = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '32px'
});

export const submitBtn = style({
  backgroundColor: colors.gray_scale['400'],
  color: 'white',
  border: 'none',
  padding: '8px 32px',
  borderRadius: '4px',
  cursor: 'pointer'
});

export const filePreview = style({
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginTop: '10px'
});

export const previewImages = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px'
});

export const previewImageBox = style({
  width: '104px',
  height: '104px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${colors.gray_scale['400']}`,
  borderRadius: '12px',
  position: 'relative'
});

export const previewImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain'
});
