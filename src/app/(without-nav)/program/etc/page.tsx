'use client';

import { IContent } from '@/entities/program/type.dto';
import { DashBoard } from '@/shared';
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';
import React, { useEffect, useState } from 'react';
import { fetchEvaluationContentsOnly } from '../evaluation/utils';
import { TableRow, TableCell } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { handleCurrentPathRoute } from '@/lib/utils';

const columns = [
  { id: 'title', label: '제목' },
  { id: 'date', label: '날짜' },
  { id: 'viewCount', label: '조회수' }
];

function ETC() {
  const categoryTree = useCategoryTreeStore.getState().categoryTree;
  const [categoryContentMap, setCategoryContentMap] = useState<IContent[]>([]);

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (id: string) => {
    const path = handleCurrentPathRoute(id, pathname);
    router.push(path);
  };

  const renderRow = (row: IContent) => (
    <TableRow
      key={row.title}
      hover
      sx={{ cursor: 'pointer' }}
      onClick={() => handleClick(row.categoryId + '')}
    >
      <TableCell>{row.title}</TableCell>
      <TableCell align="right">{row.difficultyLevel}</TableCell>
      <TableCell align="right">{`${row.year}-${row.month}`}</TableCell>
      <TableCell align="right">{row.viewCount}</TableCell>
    </TableRow>
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchEvaluationContentsOnly(categoryTree);
      setCategoryContentMap(result);
    };
    fetchData();
  }, [categoryTree]);
  return (
    <div>
      <DashBoard
        columns={columns}
        renderRow={renderRow}
        rows={categoryContentMap}
      />
    </div>
  );
}

export default ETC;
