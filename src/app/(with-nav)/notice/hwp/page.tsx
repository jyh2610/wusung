'use client';

import { colors } from '@/design-tokens';
import { DashBoard } from '@/shared';
import { TableRow, TableCell } from '@mui/material';
import { useEffect, useState } from 'react';
import { getFAQList, getHWPList } from '@/shared/api/common';
import { IAnnouncementResponse } from '@/shared/api/common';
import { useRouter } from 'next/navigation';

function HWP() {
  const router = useRouter();
  const [faqList, setFaqList] = useState<IAnnouncementResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchFAQList = async () => {
      const data = await getHWPList(currentPage - 1, pageSize); // API는 0부터 시작하므로 -1
      if (data) {
        setFaqList(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      }
    };
    fetchFAQList();
  }, [currentPage, pageSize]);

  const columns = [
    { id: 'title', label: '제목' },
    { id: 'author', label: '작성자' },
    { id: 'date', label: '날짜' },
    { id: 'views', label: '조회수' }
  ];

  const formatDate = (dateString: string) => {
    try {
      // ISO 8601 형식의 날짜 문자열을 직접 파싱
      const date = new Date(dateString);
      console.log(dateString);
      // 날짜가 유효한지 확인
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return '-';
      }

      // 한국 시간대로 변환하여 포맷팅
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Seoul'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateString);
      return '-';
    }
  };

  const renderRow = (row: IAnnouncementResponse) => (
    <TableRow
      key={row.announcementId}
      hover
      onClick={() => router.push(`/notice/hwp/${row.announcementId}`)}
      style={{ cursor: 'pointer' }}
    >
      <TableCell>{row.title}</TableCell>
      <TableCell>관리자</TableCell>
      <TableCell>{formatDate(row.updatedAt)}</TableCell>
      <TableCell>{row.views}</TableCell>
    </TableRow>
  );

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  // 페이지네이션 번호 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  // 페이지네이션 계산
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <div>
      <div>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '600',
            color: colors.gray_scale[900],
            paddingBottom: '40px'
          }}
        >
          한글 파일
        </h1>
      </div>
      <div>
        <DashBoard columns={columns} rows={faqList} renderRow={renderRow} />

        {/* 페이지네이션 */}
        {totalElements > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              padding: '0 20px'
            }}
          >
            {/* 페이지 크기 선택 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                페이지당 항목:
              </span>
              <select
                value={pageSize}
                onChange={e => handlePageSizeChange(Number(e.target.value))}
                style={{
                  padding: '5px 10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <span style={{ fontSize: '14px', color: '#666' }}>
                총 {totalElements}개 중 {startIndex + 1}-
                {Math.min(endIndex, totalElements)}개 표시
              </span>
            </div>

            {/* 페이지 번호 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: currentPage === 1 ? '#f5f5f5' : 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                이전
              </button>

              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: currentPage === pageNum ? '#007bff' : 'white',
                    color: currentPage === pageNum ? 'white' : '#333',
                    cursor: 'pointer',
                    fontSize: '14px',
                    minWidth: '40px'
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: currentPage === totalPages ? '#f5f5f5' : 'white',
                  cursor:
                    currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HWP;
