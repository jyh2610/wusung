import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const NavStyle = style({
  width: '100%',
  zIndex: 99,
  position: 'fixed',
  top: 0,
  backgroundColor: colors.brand[100]
});

export const NavInnerContainerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});

export const TopBarStyle = style({
  width: '100vw',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center'
});

export const LogoStyle = style({
  flex: '0 0 200px',
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

export const NavItemWrapperStyle = style({
  minWidth: '120px',
  textAlign: 'center',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '48px'
});

export const SubMenuBarStyle = style({
  width: '100vw',
  background: '#fff',
  display: 'flex',
  justifyContent: 'space-around',
  padding: '8px 0 16px 0',
  borderBottom: '1px solid #eee'
});

export const SubMenuSpacerStyle = style({
  flex: '0 0 200px'
});

export const SubMenuItemStyle = style({
  cursor: 'pointer',
  fontSize: '24px',
  color: colors.gray_scale[800],
  margin: '0',
  lineHeight: '100%',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  selectors: {
    '&:last-child': {
      marginBottom: 0
    }
  }
});
export const NavContentBoxStyle = style({
  width: '1360px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '25px 0'
});
