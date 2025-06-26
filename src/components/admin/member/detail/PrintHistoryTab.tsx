'use client';

import React, { useState } from 'react';
import { Card } from 'antd';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getPrintHistory } from '@/components/admin/api';
import { PrintHistory } from '@/components/admin/tpye';

interface PrintHistoryTabProps {
  memberId: number;
}

const printHistoryColumns = [
  {
    header: '출력 ID',
    accessorKey: 'printId'
  },
  {
    header: '출력 일시',
    accessorKey: 'printDate',
    cell: ({ row }: any) => {
      const date = row?.original?.printDate;
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-';
    }
  },
  {
    header: '출력 유형',
    accessorKey: 'printType'
  },
  {
    header: '출력 페이지 수',
    accessorKey: 'printCount'
  },
  {
    header: '접속 IP',
    accessorKey: 'accessIp'
  },
  {
    header: '회원 ID',
    accessorKey: 'memberId'
  }
];

export const PrintHistoryTab: React.FC<PrintHistoryTabProps> = ({
  memberId
}) => {
  const [printHistoryPage, setPrintHistoryPage] = useState(1);
  const [printHistoryPageSize, setPrintHistoryPageSize] = useState(10);

  const { data: printHistoryData } = useQuery({
    queryKey: [
      'member-print-history',
      memberId,
      printHistoryPage,
      printHistoryPageSize
    ],
    queryFn: () =>
      getPrintHistory(memberId, {
        page: printHistoryPage,
        size: printHistoryPageSize
      }),
    placeholderData: previousData => previousData
  });

  const handlePrintHistoryTableChange = (page: number, pageSize: number) => {
    setPrintHistoryPage(page);
    setPrintHistoryPageSize(pageSize);
  };

  return (
    <Card title="출력 이력 조회" className="mb-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {printHistoryColumns.map(column => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!printHistoryData ? (
              <TableRow>
                <TableCell
                  colSpan={printHistoryColumns.length}
                  className="text-center"
                >
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : printHistoryData.content.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={printHistoryColumns.length}
                  className="text-center"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              printHistoryData.content.map((row: PrintHistory) => (
                <TableRow key={row.printId}>
                  <TableCell>{row.printId}</TableCell>
                  <TableCell>
                    {dayjs(row.printDate).format('YYYY-MM-DD HH:mm:ss')}
                  </TableCell>
                  <TableCell>{row.printType}</TableCell>
                  <TableCell>{row.printCount}</TableCell>
                  <TableCell>{row.accessIp}</TableCell>
                  <TableCell>{row.memberId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {printHistoryData && printHistoryData.totalElements > 0 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={e => {
                    e.preventDefault();
                    if (printHistoryPage > 1) {
                      handlePrintHistoryTableChange(
                        printHistoryPage - 1,
                        printHistoryPageSize
                      );
                    }
                  }}
                />
              </PaginationItem>
              {Array.from(
                {
                  length: Math.ceil(
                    printHistoryData.totalElements / printHistoryPageSize
                  )
                },
                (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={e => {
                        e.preventDefault();
                        handlePrintHistoryTableChange(
                          i + 1,
                          printHistoryPageSize
                        );
                      }}
                      isActive={i + 1 === printHistoryPage}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={e => {
                    e.preventDefault();
                    if (
                      printHistoryPage <
                      Math.ceil(
                        printHistoryData.totalElements / printHistoryPageSize
                      )
                    ) {
                      handlePrintHistoryTableChange(
                        printHistoryPage + 1,
                        printHistoryPageSize
                      );
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};
