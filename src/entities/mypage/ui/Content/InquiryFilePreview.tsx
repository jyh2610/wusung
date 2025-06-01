import React from 'react';

interface InquiryFilePreviewProps {
  url: string;
  name?: string;
}

export function InquiryFilePreview({ url, name }: InquiryFilePreviewProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 120
      }}
    >
      <img
        src={url}
        alt={name || '첨부 이미지'}
        style={{
          width: 100,
          height: 100,
          objectFit: 'cover',
          borderRadius: 8,
          border: '1px solid #eee',
          marginBottom: 4
        }}
      />
      <span style={{ fontSize: 12, color: '#555', wordBreak: 'break-all' }}>
        {name || '첨부 이미지'}
      </span>
    </div>
  );
}
