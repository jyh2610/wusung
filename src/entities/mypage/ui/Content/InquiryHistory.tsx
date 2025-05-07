import { useState } from 'react';
import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import {
  completeText,
  header,
  label,
  listDate,
  paymentBtn,
  paymentContent,
  selectedPaymentBtn,
  tableStyle,
  thStyle,
  tdStyle,
  trStyle,
  tdTitle,
  beforeStyle,
  completeRowStyle,
  date,
  tableContainer
} from './payment/paymentHistory.css';

export function InquiryHistory() {
  const payments = [
    { title: '문의글 제목 1', date: '2024.05.27', isCompleted: true },
    { title: '문의글 제목 2', date: '2024.06.10', isCompleted: false },
    { title: '문의글 제목 3', date: '2024.07.15', isCompleted: true }
  ];
  const [selectedPayment, setSelectedPayment] = useState('전체');

  const getStatusText = (isCompleted: boolean) =>
    isCompleted ? '결제 완료' : '결제 필요';

  return (
    <div>
      <div className={header}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <span>문의내역</span>
          {/* <div style={{ width: '160px', height: '50px' }}>
            <Button content="인증서발급" type="borderBrand" />
          </div> */}
        </div>
        {/* <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {paymentState.map(state => (
            <button
              key={state}
              className={`${paymentBtn} ${selectedPayment === state ? selectedPaymentBtn : ''}`}
              onClick={() => setSelectedPayment(state)}
            >
              {state}
            </button>
          ))}
        </div> */}
      </div>

      <div className={tableContainer}>
        <table className={tableStyle}>
          <thead>
            <tr className={trStyle}>
              <th className={thStyle}>제목</th>
              <th className={thStyle}>날짜</th>
              <th className={thStyle}>답변 상태</th>
            </tr>
          </thead>
          <tbody>
            <tr className={trStyle}>
              <td className={`${tdStyle} ${tdTitle}`}>문의글 제목 1</td>
              <td className={`${tdStyle} ${date}`}>2024.05.27</td>
              <td className={`${tdStyle}`}>
                <div className={beforeStyle}>답변 완료</div>
              </td>
            </tr>
            <tr className={trStyle}>
              <td className={`${tdStyle} ${tdTitle}`}>문의글 제목 2</td>
              <td className={`${tdStyle} ${date}`}>2024.06.10</td>
              <td className={`${tdStyle} `}>
                <div className={completeRowStyle}>답변 미완</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
