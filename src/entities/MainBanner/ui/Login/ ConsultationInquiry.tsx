import { colors } from '@/design-tokens';
import { companyInfo } from '@/shared/const/Info';
import { ConsultationInquiryStyles } from './ConsultationInquiry.css';

export function ConsultationInquiry() {
  return (
    <div className={ConsultationInquiryStyles}>
      <p>
        <span>상담문의</span>
        <span style={{ color: colors.brand[500] }}>
          {' ' + companyInfo.phone}
        </span>
      </p>
    </div>
  );
}
