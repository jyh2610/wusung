import React from 'react';
import { companyInfo } from '@/shared/const/Info';
import { footerContentStyle, footerStyle } from './index.css';

export function Footer() {
  return (
    <div className={footerStyle}>
      <div className={footerContentStyle}>
        <p>
          {companyInfo.name} | 대표 : {companyInfo.representName} |
          사업자등록번호: {companyInfo.businessNumber} | Tel. :{'070-4671-7901'}{' '}
          | 통신판매번호 : {companyInfo.paymentNumber}
        </p>
        <p>주소 : {companyInfo.address}</p>
        <p>Copyright © 2020 - 2024 {companyInfo.name} All rights reserved.</p>
      </div>
    </div>
  );
}
