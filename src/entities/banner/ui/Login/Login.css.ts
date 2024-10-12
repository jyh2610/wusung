import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens/colors';

export const bannerContentsStyle = style({
  marginTop: '80.5px',
  marginLeft: '68%'
});

export const LoginStyles = style({
  width: '360px',
  height: '505px',
  backgroundColor: colors.gray_scale['default'],
  zIndex: 1,
  borderRadius: '20px',
  padding: '40px 40px 32px 40px'
});

export const LoginHeaderStyles = style({
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '28.64px',
  color: colors.gray_scale['800']
});

export const LoginBodyStyles = style({
  marginTop: '32px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px'
});

export const LoginBottomStyles = style({
  marginTop: '28px'
});
