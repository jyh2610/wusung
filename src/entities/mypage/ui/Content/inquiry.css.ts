import { style } from '@vanilla-extract/css';

export const inquiryList = style({
  display: 'flex'
});

export const detailWrapper = style({
  background: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '40px',
  borderRadius: 16
});

export const detailCard = style({
  background: '#fff',
  borderRadius: 16,
  padding: '40px 0',
  width: '100%',
  maxWidth: 'none',
  minWidth: 0,
  boxSizing: 'border-box'
});

export const detailButton = style({
  marginBottom: 32,
  padding: '12px 28px',
  borderRadius: 10,
  border: '1.5px solid #e0e0e0',
  color: '#222',
  fontWeight: 600,
  fontSize: 20,
  cursor: 'pointer',
  transition: 'background 0.2s',
  letterSpacing: 1,
  background: 'none'
});

export const detailTitle = style({
  fontSize: 28,
  fontWeight: 700,
  margin: 0,
  marginBottom: 28,
  color: '#222',
  letterSpacing: 1
});

export const detailHr = style({
  border: 0,
  borderTop: '2px solid #f0f0f0',
  margin: '0 0 32px 0'
});

export const detailTable = style({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  marginBottom: 36,
  fontSize: 20,
  color: '#222',
  lineHeight: 1.7
});

export const detailTh = style({
  textAlign: 'left',
  width: 110,
  color: '#888',
  fontWeight: 600,
  padding: '12px 0',
  fontSize: 20
});

export const detailTd = style({
  padding: '12px 0',
  fontSize: 20,
  whiteSpace: 'pre-line'
});

export const detailStatus = style({
  display: 'inline-block',
  padding: '4px 16px',
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: 1
});

export const detailSectionTitle = style({
  fontSize: 22,
  color: '#222',
  fontWeight: 700
});

export const detailImageList = style({
  display: 'flex',
  gap: 20,
  marginTop: 14,
  flexWrap: 'wrap',
  marginBottom: 36
});

export const detailCommentList = style({
  marginTop: 14,
  paddingLeft: 20,
  listStyle: 'disc',
  color: '#444',
  fontSize: 20,
  lineHeight: 1.8
});

export const detailCommentItem = style({
  marginBottom: 16,
  lineHeight: 1.8
});

export const detailNoData = style({
  color: '#aaa',
  fontSize: 18
});
