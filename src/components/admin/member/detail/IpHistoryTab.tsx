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
import { getIpList } from '@/components/admin/api';
import { IpList } from '@/components/admin/tpye';

interface IpHistoryTabProps {
  memberId: number;
}

const ipListColumns = [
  {
    header: '회원 ID',
    accessorKey: 'memberId'
  },
  {
    header: 'IP 주소',
    accessorKey: 'ipAddress'
  },
  {
    header: '작업 유형',
    accessorKey: 'operationType'
  },
  {
    header: '업데이트 시간',
    accessorKey: 'updatedAt'
  }
];

export const IpHistoryTab: React.FC<IpHistoryTabProps> = ({ memberId }) => {
  const [ipListPage, setIpListPage] = useState(1);
  const [ipListPageSize, setIpListPageSize] = useState(10);

  const { data: ipListData } = useQuery({
    queryKey: ['member-ip-list', memberId, ipListPage, ipListPageSize],
    queryFn: () =>
      getIpList(memberId, {
        page: ipListPage - 1,
        size: ipListPageSize
      }),
    placeholderData: previousData => previousData
  });

  const handleIpListTableChange = (page: number, pageSize: number) => {
    setIpListPage(page);
    setIpListPageSize(pageSize);
  };

  return (
    <Card title="IP 접속 기록" className="mb-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {ipListColumns.map(column => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ipListData ? (
              <TableRow>
                <TableCell
                  colSpan={ipListColumns.length}
                  className="text-center"
                >
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : ipListData.content.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={ipListColumns.length}
                  className="text-center"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              ipListData.content.map((row: IpList) => (
                <TableRow key={`${row.ipAddress}-${row.updatedAt}`}>
                  <TableCell>{row.memberId}</TableCell>
                  <TableCell>{row.ipAddress}</TableCell>
                  <TableCell>{row.operationType}</TableCell>
                  <TableCell>
                    {dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {ipListData && ipListData.totalElements > 0 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={e => {
                    e.preventDefault();
                    if (ipListPage > 1) {
                      handleIpListTableChange(ipListPage - 1, ipListPageSize);
                    }
                  }}
                />
              </PaginationItem>
              {Array.from(
                {
                  length: Math.ceil(ipListData.totalElements / ipListPageSize)
                },
                (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={e => {
                        e.preventDefault();
                        handleIpListTableChange(i + 1, ipListPageSize);
                      }}
                      isActive={i + 1 === ipListPage}
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
                      ipListPage <
                      Math.ceil(ipListData.totalElements / ipListPageSize)
                    ) {
                      handleIpListTableChange(ipListPage + 1, ipListPageSize);
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
