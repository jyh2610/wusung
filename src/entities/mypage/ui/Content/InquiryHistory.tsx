import { useState } from 'react';
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
import {
  personalInquiry,
  getInquiryDetail,
  addReply
} from '@/entities/mypage/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IInquiry } from '@/entities/mypage/type';
import { filterInquiries } from '../../utils';
import { InquiryDetail } from './InquiryDetail';

const FILTER_OPTIONS = ['전체', '3개월전', '6개월전', '12개월전'];
const PAGE_SIZE = 10;

export function InquiryHistory() {
  const [selectedFilter, setSelectedFilter] = useState<string>('전체');
  const [page, setPage] = useState<number>(1);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(
    null
  );
  const [monthsAgo, setMonthsAgo] = useState<number>(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['personalInquiry', page, monthsAgo],
    queryFn: () => personalInquiry(page - 1, PAGE_SIZE, monthsAgo)
  });

  const { data: inquiryDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['inquiryDetail', selectedInquiryId],
    queryFn: () =>
      selectedInquiryId ? getInquiryDetail(selectedInquiryId) : null,
    enabled: !!selectedInquiryId
  });

  console.log('inquiryDetail:', inquiryDetail);

  const inquiries = (data?.data.content as IInquiry[][])?.flat() || [];
  const filteredInquiries = filterInquiries(inquiries, selectedFilter);
  const totalElements = data?.data.totalElements || 0;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const handleFilter = (option: string) => {
    setSelectedFilter(option);
    setPage(1);
    // 필터 옵션에 따라 monthsAgo 설정
    if (option === '3개월전') {
      setMonthsAgo(3);
    } else if (option === '6개월전') {
      setMonthsAgo(6);
    } else if (option === '12개월전') {
      setMonthsAgo(12);
    } else {
      setMonthsAgo(0); // 전체
    }
  };

  const handleAddReply = async (
    commentId: number,
    content: string,
    files?: globalThis.File[]
  ) => {
    try {
      await addReply(commentId, content, files);
      // 답글 등록 후 상세 정보 다시 불러오기
      if (selectedInquiryId) {
        const updatedDetail = await getInquiryDetail(selectedInquiryId);
        // 여기서 상태 업데이트 로직 추가 필요
      }
    } catch (error) {
      console.error('답글 등록 실패:', error);
    }
  };

  const handleRefresh = async () => {
    if (selectedInquiryId) {
      // 캐시 무효화 후 데이터 다시 가져오기
      await queryClient.invalidateQueries({
        queryKey: ['inquiryDetail', selectedInquiryId]
      });
    }
  };

  if (selectedInquiryId && inquiryDetail) {
    const inquiryData = inquiryDetail.data;
    return (
      <InquiryDetail
        inquiry={inquiryData.inquiry}
        comments={inquiryData.comments || []}
        files={inquiryData.files || []}
        onBack={() => setSelectedInquiryId(null)}
        onAddReply={handleAddReply}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <div>
      <div className={header}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          <span>문의내역</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {FILTER_OPTIONS.map(option => (
            <button
              key={option}
              className={`${paymentBtn} ${selectedFilter === option ? selectedPaymentBtn : ''}`}
              onClick={() => handleFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
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
            {isLoading ? (
              <tr className={trStyle}>
                <td className={tdStyle} colSpan={3}>
                  로딩 중...
                </td>
              </tr>
            ) : !filteredInquiries.length ? (
              <tr className={trStyle}>
                <td className={tdStyle} colSpan={3}>
                  문의 내역이 없습니다.
                </td>
              </tr>
            ) : (
              filteredInquiries.map(inquiry => (
                <tr
                  className={trStyle}
                  key={inquiry.inquiryId}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedInquiryId(inquiry.inquiryId)}
                >
                  <td className={`${tdStyle} ${tdTitle}`}>{inquiry.title}</td>
                  <td className={`${tdStyle} ${date}`}>
                    {inquiry.updatedAt.slice(0, 10).replace(/-/g, '.')}
                  </td>
                  <td className={tdStyle}>
                    <div
                      className={
                        inquiry.isAnswered ? completeRowStyle : beforeStyle
                      }
                    >
                      {inquiry.isAnswered ? '답변 완료' : '답변 미완'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '24px 0',
          gap: 8
        }}
      >
        {Array.from({ length: totalPages }, (_, idx) => {
          const pageNum = idx + 1;
          const isActive = page === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              style={{
                minWidth: 32,
                height: 32,
                borderRadius: 6,
                border: '1px solid #ddd',
                background: isActive ? '#e1007b' : '#fff',
                color: isActive ? '#fff' : '#222',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s'
              }}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
