import { style } from '@vanilla-extract/css';
import { colors } from '@/design-tokens';

export const modalContainer = style({ padding: '60px 60px 48px 60px' });
export const title = style({
  fontSize: '28px',
  fontWeight: 500,
  lineHeight: '33.41px',
  color: colors.gray_scale[800],
  marginBottom: '32px'
});

export const termsModalBody = style({
  height: '600px',
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  marginBottom: '40px'
});

export const personalModalBody = style({
  height: '224px',
  color: colors.gray_scale[700],
  marginBottom: '40px'
});

export const cellStyle = style({
  border: `1px solid ${colors.gray_scale[400]}`,
  padding: '8px',
  textAlign: 'center',
  height: '69px',
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '25px',
  letterSpacing: '-2.5%'
});
