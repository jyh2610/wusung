import { style } from '@vanilla-extract/css';

export const NavStyle = style({
  width: '100vw',
  height: '135px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const ListContainerStyle = style({
  maxWidth: '1360px',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '75px'
});

export const LogoStyle = style({
  backgroundColor: 'black',
  width: '190px',
  height: '95px'
});

export const NavListStyle = style({
  width: '1096px',
  display: 'flex',
  justifyContent: 'space-between'
});
