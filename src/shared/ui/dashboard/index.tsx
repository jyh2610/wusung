'use client';

import { IContent } from '@/entities/program/type.dto';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

// 데이터 타입 정의

interface DashBoardProps {
  rows: IContent[];
}

export function DashBoard({ rows }: DashBoardProps) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // 현재 페이지 데이터 가져오기
  const currentData = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="게시판 테이블">
          <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell align="right">난이도</TableCell>
              <TableCell align="right">날짜</TableCell>
              <TableCell align="right">조회수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map(row => (
                <TableRow key={row.title}>
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.difficultyLevel}</TableCell>
                  <TableCell align="right">{`${row.year}-${row.month}`}</TableCell>
                  <TableCell align="right">{row.viewCount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Content
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 (데이터 있을 때만) */}
      {rows.length > 0 && (
        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          sx={{ marginTop: 2 }}
        >
          <Pagination
            count={Math.ceil(rows.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
      )}
    </>
  );
}
