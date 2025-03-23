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

export const layout = style({
  marginTop: '140.4px',
  minHeight: 'calc(100vh - 303px)',
  flex: 1,
  backgroundColor: 'rgba(251, 250, 247, 1)'
});
