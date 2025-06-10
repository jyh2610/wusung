import React from 'react';
import {
  detailFileItem,
  detailFileName,
  detailFileDownload
} from './inquiry.css';

interface InquiryFilePreviewProps {
  url: string;
  name?: string;
}

export function InquiryFilePreview({ url, name }: InquiryFilePreviewProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name || '파일';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={detailFileItem}>
      <span className={detailFileName}>{name || '파일'}</span>
      <button onClick={handleDownload} className={detailFileDownload}>
        다운로드
      </button>
    </div>
  );
}
