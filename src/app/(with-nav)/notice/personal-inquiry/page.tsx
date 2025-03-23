import { Personal } from '@/entities/inquiry';
import { pageHeader, pageTitle, viewInquiriesBtn } from './index.css';

export default function PersonalInquiry() {
  return (
    <div>
      <div className={pageHeader}>
        <h2 className={pageTitle}>1:1 문의</h2>
        <button className={viewInquiriesBtn}>문의내역 보기</button>
      </div>
      <Personal />
    </div>
  );
}
