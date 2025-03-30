'use client';

import Image from 'next/image';
import { useState } from 'react';
import { listContainer, listBox, content, date } from './index.css';

const mockData = [
  { createAt: '2025.02.01', content: '2024 방문목욕 급여수가 및 본인부담금' },
  { createAt: '2025.02.01', content: '2024 방문목욕 급여수가 및 본인부담금' },
  { createAt: '2025.02.01', content: '2024 방문목욕 급여수가 및 본인부담금' },
  { createAt: '2025.02.01', content: '2024 방문목욕 급여수가 및 본인부담금' },
  { createAt: '2025.02.01', content: '2024 방문목욕 급여수가 및 본인부담금' }
];

export function NoticeList() {
  const [hoveredList, setHoveredList] = useState<number | null>(null);
  return (
    <div className={listContainer} onMouseLeave={() => setHoveredList(null)}>
      {mockData.map((item, index) => (
        <div
          key={index}
          className={listBox}
          onMouseEnter={() => setHoveredList(index)}
        >
          <p className={content}>{item.content}</p>
          {hoveredList === index ? (
            <Image
              width={27.23}
              height={21.47}
              src={'/images/arrowRight.svg'}
              alt={'arrowRight'}
            />
          ) : (
            <p className={date}>{item.createAt}</p>
          )}
        </div>
      ))}
    </div>
  );
}
