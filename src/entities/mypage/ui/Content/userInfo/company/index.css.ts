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
