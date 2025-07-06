import { colors } from '@/design-tokens';
import {
  ArrowBigLeft,
  ArrowBigRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import React, { useState } from 'react';

interface IProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (i: number) => void;
}

export function Pageable({
  currentPage,
  handlePageChange,
  totalPages
}: IProps) {
  const [currentGroup, setCurrentGroup] = useState(0);
  const pagesPerGroup = 10;

  // 현재 그룹 계산
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup;
  const endPage = Math.min(startPage + pagesPerGroup, totalPages);

  // 현재 페이지가 속한 그룹으로 이동
  React.useEffect(() => {
    const pageGroup = Math.floor(currentPage / pagesPerGroup);
    setCurrentGroup(pageGroup);
  }, [currentPage]);

  const handlePrevGroup = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
      const newPage = (currentGroup - 1) * pagesPerGroup;
      handlePageChange(newPage);
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < totalGroups - 1) {
      setCurrentGroup(currentGroup + 1);
      const newPage = (currentGroup + 1) * pagesPerGroup;
      handlePageChange(newPage);
    }
  };

  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {/* 이전 그룹 버튼 */}
        <button
          onClick={handlePrevGroup}
          disabled={currentGroup === 0}
          style={{
            padding: '5px 10px',
            backgroundColor: currentGroup === 0 ? '#e0e0e0' : '#f0f0f0',
            border: 'none',
            cursor: currentGroup === 0 ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            fontSize: '14px',
            opacity: currentGroup === 0 ? 0.5 : 1
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* 페이지 번호들 */}
        {totalPages > 0 && (
          <div style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: endPage - startPage }, (_, i) => {
              const pageNumber = startPage + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={currentPage === pageNumber}
                  style={{
                    padding: '5px 10px',
                    backgroundColor:
                      currentPage === pageNumber
                        ? colors.brand[300]
                        : '#f0f0f0',
                    border: 'none',
                    cursor: 'pointer',
                    color: currentPage === pageNumber ? 'white' : 'black',
                    borderRadius: '4px',
                    minWidth: '35px'
                  }}
                >
                  {pageNumber + 1}
                </button>
              );
            })}
          </div>
        )}

        {/* 다음 그룹 버튼 */}
        <button
          onClick={handleNextGroup}
          disabled={currentGroup >= totalGroups - 1}
          style={{
            padding: '5px 10px',
            backgroundColor:
              currentGroup >= totalGroups - 1 ? '#e0e0e0' : '#f0f0f0',
            border: 'none',
            cursor: currentGroup >= totalGroups - 1 ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            fontSize: '14px',
            opacity: currentGroup >= totalGroups - 1 ? 0.5 : 1
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
