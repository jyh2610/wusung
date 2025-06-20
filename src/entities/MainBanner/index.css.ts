import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const bannerStyle = style({
  maxWidth: '1920px',
  height: '700px',
  backgroundPosition: 'left',
  display: 'flex',
  marginLeft: '106px',
  overflow: 'hidden',
  borderTopLeftRadius: '120px',
  borderBottomLeftRadius: '120px'
});

export const bannerHeaderStyles = style({
  width: '553px',
  height: '76px',
  textAlign: 'center',
  backgroundColor: 'rgba(35, 37, 39, 0.4)',
  padding: '9px 10px',
  position: 'absolute',
  marginTop: '50px',
  marginLeft: '600px',
  color: '#FFFFFF',
  fontSize: '48px',
  fontWeight: '600',
  lineHeight: '57.28px',
  '@media': {
    'screen and (max-width: 1440px)': {
      marginLeft: '20%'
    }
  }
});
