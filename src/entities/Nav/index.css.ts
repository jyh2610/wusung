// index.css 파일에서 스타일을 수정
import { style } from '@vanilla-extract/css';

export const NavStyle = style({
  width: '100vw',
  height: '135px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const ListContainerStyle = style({
  width: '90%',
  maxWidth: '1360px',
  height: '62px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '5%'
});

export const LogoStyle = style({
  width: '13%',
  height: '85px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  selectors: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
});

export const NavListStyle = style({
  width: '70%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '11.5px'
});
