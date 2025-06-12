'use client';

import { colors } from '@/design-tokens';
import { DashBoard } from '@/shared';
import { TableRow, TableCell } from '@mui/material';
import { useEffect, useState } from 'react';
import { getFAQList } from '@/shared/api/common';
import { IAnnouncementResponse } from '@/shared/api/common';

function Inquiry() {
  const [faqList, setFaqList] = useState<IAnnouncementResponse[]>([]);

  useEffect(() => {
    const fetchFAQList = async () => {
      const data = await getFAQList();
      if (data) {
        setFaqList(data.content);
      }
    };
    fetchFAQList();
  }, []);

  const columns = [
    { id: 'title', label: '제목' },
    { id: 'author', label: '작성자' },
    { id: 'date', label: '날짜' },
    { id: 'views', label: '조회수' }
  ];

  const renderRow = (row: IAnnouncementResponse) => (
    <TableRow key={row.announcementId} hover>
      <TableCell>{row.title}</TableCell>
      <TableCell align="right">관리자</TableCell>
      <TableCell align="right">
        {new Date(row.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell align="right">{row.views}</TableCell>
    </TableRow>
  );

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
          자주 묻는 질문
        </h1>
      </div>
      <div>
        <DashBoard columns={columns} rows={faqList} renderRow={renderRow} />
      </div>
    </div>
  );
}

export default Inquiry;
