import {
  createTheme,
  createThemeContract,
  globalStyle,
  style
} from '@vanilla-extract/css';

// export const container = style({
//   padding: 10,
//   backgroundColor: 'red'
// });

export const mtStyle = style({
  display: 'flex',
  paddingTop: '10px'
});

globalStyle('body', {
  backgroundColor: 'yellow'
});

export const themeVars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

export const container = style({
  background: themeVars.color.brand,
  fontFamily: themeVars.font.body
});
