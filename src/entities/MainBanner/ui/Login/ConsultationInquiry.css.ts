import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const ConsultationInquiryStyles = style({
  marginTop: '4px',
  height: '49px',
  backgroundColor: colors.gray_scale['default'],
  borderRadius: '12px',
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5px'
});
