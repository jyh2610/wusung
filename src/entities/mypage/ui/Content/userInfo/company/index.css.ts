import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const profileWrapper = style({
  marginTop: '32px',
  display: 'flex',
  gap: '10px'
});

export const profileLabel = style({
  width: '176px',
  fontSize: '28px',
  lineHeight: '100%',
  fontWeight: 500
});

export const companyEditContainer = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '40px'
});

export const container = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px'
});

export const row = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 40,
  width: '100%',
  height: '100%'
});

export const label = style({
  width: '176px',
  display: 'inline-block',
  fontSize: '28px',
  fontWeight: '500',
  lineHeight: '33.41px',
  color: colors.gray_scale[800]
});

export const input = style({
  width: '100%',
  height: 57,
  borderRadius: 12,
  border: '1px solid #eee',
  padding: '0 16px',
  fontSize: 16,
  background: colors.gray_scale[300],
  color: colors.gray_scale[800]
});

export const buttonWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
});
