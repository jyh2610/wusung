import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.gray_scale['default'],
  padding: '60px 70px 48px 80px',
  gap: '32px',
  borderRadius: '20px',
  width: '100%'
});

export const title = style({
  fontSize: '48px',
  fontWeight: '600',
  color: colors.gray_scale['900'],
  textAlign: 'center',
  marginBottom: '40px'
});

export const label = style({
  fontSize: '24px',
  fontWeight: '600',
  color: colors.gray_scale['900']
});
