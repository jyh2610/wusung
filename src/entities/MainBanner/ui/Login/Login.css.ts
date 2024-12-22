import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens/colors';

export const bannerContentsStyle = style({
  height: '505px',
  marginTop: '80.5px',
  marginLeft: '68%'
});

export const LoginStyles = style({
  width: '360px',
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

export const LogedOutStyles = style({
  backgroundColor: colors.brand[700]
});

export const LoginBottomStyles = style({
  margin: '28px 0 32px 0',
  height: '56px'
});

export const InfoFucStyles = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '16px',
  textAlign: 'center',
  selectors: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
});

export const InfoContentStyles = style({
  fontSize: '18px',
  lineHeight: '25px',
  fontWeight: '500',
  color: colors.gray_scale[700],
  selectors: {
    '&:hover': {
      color: colors.brand[400]
    }
  }
});

export const logoutStyles = style({
  width: '100%',
  color: colors.gray_scale[700],
  fontSize: '18px',
  fontWeight: '500',
  lineHeight: '25px',
  cursor: 'pointer',
  letterSpacing: '-2.5%',
  border: 'none',
  backgroundColor: 'transparent',
  marginTop: '16px'
});
