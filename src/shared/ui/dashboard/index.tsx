'use client';

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

interface Column {
  id: string;
  label: string;
  align?: 'right' | 'left' | 'center';
  width?: string;
}

interface DashBoardProps<T> {
  rows: T[];
  columns: Column[];
  renderRow: (row: T) => React.ReactNode;
  rowsPerPage?: number;
  page?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export function DashBoard<T>({
  rows,
  columns,
  renderRow,
  rowsPerPage = 10,
  page = 0,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange
}: DashBoardProps<T>) {
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange?.(value - 1);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="custom table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ width: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map(row => renderRow(row))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No Content
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalCount > 0 && (
        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page + 1}
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
