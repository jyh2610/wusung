import { style } from '@vanilla-extract/css';

export const siteStyle = style({
  width: '100%',
  height: '178px',
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#F7F7F7',
  boxShadow: '0px 0px 16px 0px rgba(53, 4, 34, 0.08)'
});
export const imageContainerStyle = style({
  width: '120px',
  height: '120px',
  position: 'relative'
});

export const companyContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '90px'
});

export const companyStyle = style({
  margin: 'auto',
  textDecoration: 'none',
  color: 'inherit'
});

export const contentStyle = style({
  color: 'rgba(68, 68, 68, 1)',
  fontSize: '18px',
  lineHeight: '25px',
  fontWeight: '400',
  letterSpacing: '-2.5%'
});

export const titleStyle = style({
  color: 'rgba(35, 37, 39, 1)',
  fontSize: '24px',
  fontWeight: '500',
  lineHeight: '28.64px',
  letterSpacing: '-2.5%'
});
