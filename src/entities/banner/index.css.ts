import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const bannerStyle = style({
  maxWidth: '1920px',
  height: '700px',
  backgroundImage: 'url(/images/banner.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'left',
  display: 'flex',
  marginLeft: '106px',
  overflow: 'hidden',
  borderTopLeftRadius: '120px',
  borderBottomLeftRadius: '120px'
});
