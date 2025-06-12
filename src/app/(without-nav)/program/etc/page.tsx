'use client';

import { IContent, IContentList } from '@/entities/program/type.dto';
import { DashBoard } from '@/shared';
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';
import React, { useEffect, useState } from 'react';
import {
  fetchEvaluationContentsOnly,
  getContentList
} from '../evaluation/utils';
import {
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { handleCurrentPathRoute } from '@/lib/utils';

const columns = [
  { id: 'title', label: '제목' },
  { id: 'date', label: '날짜' },
  { id: 'viewCount', label: '조회수' }
];

function ETC() {
  const categoryIndividualList =
    useCategoryTreeStore.getState().categoryIndividualList;
  const [categoryContentMap, setCategoryContentMap] = useState<IContentList[]>(
    []
  );
  const [difficultyFilter, setDifficultyFilter] = useState<number>(3);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 10;

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (id: string) => {
    const path = handleCurrentPathRoute(id, pathname);
    router.push(path);
  };

  const renderRow = (row: IContentList) => (
    <TableRow
      key={row.title}
      hover
      sx={{ cursor: 'pointer' }}
      onClick={() => handleClick(row.eduContentId + '')}
    >
      <TableCell>{row.title}</TableCell>
      <TableCell align="right">{`${row.year}-${row.month}`}</TableCell>
      <TableCell align="right">{row.viewCount}</TableCell>
    </TableRow>
  );

  useEffect(() => {
    const fetchData = async () => {
      const etcCategory = categoryIndividualList.find(
        category => category.name === '기타자료'
      );
      if (!etcCategory) return;

      const result = await getContentList({
        categoryId: etcCategory.categoryId,
        difficultyLevel: difficultyFilter,
        page: page,
        size: pageSize
      });
      setCategoryContentMap(result.data.data.content.flat());
      setTotalPages(result.data.data.totalPages);
    };
    fetchData();
  }, [categoryIndividualList, difficultyFilter, page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>난이도</InputLabel>
          <Select
            value={difficultyFilter}
            label="난이도"
            onChange={e => setDifficultyFilter(Number(e.target.value))}
          >
            <MenuItem value={0}>없음</MenuItem>
            <MenuItem value={3}>쉬움</MenuItem>
            <MenuItem value={2}>보통</MenuItem>
            <MenuItem value={1}>어려움</MenuItem>
          </Select>
        </FormControl>
      </div>
      <DashBoard
        columns={columns}
        renderRow={renderRow}
        rows={categoryContentMap}
      />
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
}

export default ETC;
