import { colors } from '@/design-tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: colors.gray_scale.default,
  borderRadius: '20px',
  padding: '40px'
});
export const header = style({
  color: colors.gray_scale[900],
  fontSize: '32px',
  lineHeight: '100%',
  letterSpacing: '0%',
  fontWeight: 600
});
export const headcontainer = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const headerBtn = style({
  width: '132px',
  height: '49px'
});

export const noData = style({
  color: colors.gray_scale[600],
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '-2.5%',
  minHeight: '109px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const formContainer = style({
  marginTop: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px'
});

export const labelContainer = style({
  width: '176px',
  fontSize: '28px',
  fontWeight: '500',
  lineHeight: '33.41px',
  color: colors.gray_scale[800]
});
export const starSpan = style({
  color: colors.brand[400]
});

export const emailBox = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
});

export const regBtn = style({
  width: '140px',
  height: '56px',
  position: 'relative'
});

export const inputBox = style({ display: 'flex', gap: '12px' });

export const managerCard = style({
  backgroundColor: colors.gray_scale.default,
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${colors.gray_scale[200]}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    borderColor: colors.brand[300]
  }
});

export const managerHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '24px'
});

export const managerAvatar = style({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: colors.brand[400],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.gray_scale.default,
  fontSize: '24px',
  fontWeight: '600'
});

export const managerInfo = style({
  flex: 1
});

export const managerName = style({
  fontSize: '24px',
  fontWeight: '600',
  color: colors.gray_scale[900],
  marginBottom: '4px'
});

export const managerJobGrade = style({
  fontSize: '16px',
  color: colors.brand[500],
  fontWeight: '500'
});

export const managerDetails = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginTop: '20px'
});

export const detailItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

export const detailLabel = style({
  fontSize: '14px',
  color: colors.gray_scale[600],
  fontWeight: '500'
});

export const detailValue = style({
  fontSize: '16px',
  color: colors.gray_scale[900],
  fontWeight: '400',
  wordBreak: 'break-all'
});

export const editButton = style({
  position: 'absolute',
  top: '16px',
  right: '16px',
  padding: '8px 12px',
  backgroundColor: colors.brand[0],
  border: `1px solid ${colors.brand[200]}`,
  borderRadius: '8px',
  color: colors.brand[600],
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  ':hover': {
    backgroundColor: colors.brand[100],
    borderColor: colors.brand[300]
  }
});
