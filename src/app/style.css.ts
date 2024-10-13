import {
  createTheme,
  createThemeContract,
  globalStyle,
  style
} from '@vanilla-extract/css';

export const mtStyle = style({
  display: 'flex',
  paddingTop: '10px'
});

export const themeVars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

export const MainStyles = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});
