import { colors } from '@/design-tokens';
import React from 'react';

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
  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px'
        }}
      >
        <div>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              disabled={currentPage === i}
              style={{
                margin: '0 5px',
                padding: '5px 10px',
                backgroundColor:
                  currentPage === i ? colors.brand[300] : '#f0f0f0',
                border: 'none',
                cursor: 'pointer',
                color: currentPage === i ? 'white' : 'black',
                borderRadius: '4px'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
