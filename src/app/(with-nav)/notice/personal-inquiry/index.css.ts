import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

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
