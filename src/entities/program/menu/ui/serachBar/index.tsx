import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { container, searchInput } from './index.css';
export function SearchBar() {
  return (
    <div className={container}>
      <input
        type="text"
        placeholder="검색어를 입력해주세요"
        className={searchInput}
      />
      <FiSearch
        size={20}
        color="#888"
        style={{
          position: 'absolute',
          right: '25px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer'
        }}
      />
    </div>
  );
}
