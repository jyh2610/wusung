'use client';

import { colors } from '@/design-tokens';
import { DashBoard } from '@/shared';
import { TableRow, TableCell } from '@mui/material';

function Inquiry() {
  const columns = [
    { id: 'title', label: '제목' },
    { id: 'author', label: '작성자' },
    { id: 'date', label: '날짜' },
    { id: 'views', label: '조회수' }
  ];

  const renderRow = (row: ReturnType<typeof createData>) => (
    <TableRow key={row.title} hover>
      <TableCell>{row.title}</TableCell>
      <TableCell align="right">{row.author}</TableCell>
      <TableCell align="right">{row.date}</TableCell>
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
        <DashBoard columns={columns} rows={rows} renderRow={renderRow} />
      </div>
    </div>
  );
}

const rows = [
  createData('Post 1', 'John Doe', '2025-03-01', 120),
  createData('Post 2', 'Jane Smith', '2025-03-02', 150),
  createData('Post 3', 'Alice Johnson', '2025-03-03', 98),
  createData('Post 4', 'Bob Brown', '2025-03-04', 75),
  createData('Post 5', 'Charlie Green', '2025-03-05', 220)
  // 데이터가 없으면 빈 배열로 설정 []
];
function createData(
  title: string,
  author: string,
  date: string,
  views: number
) {
  return { title, author, date, views };
}

export default Inquiry;
