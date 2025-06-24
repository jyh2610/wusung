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
import { getMemberChangeHistory } from '@/components/admin/api';
import { MemberChangeHistory } from '@/components/admin/api';

interface ChangeHistoryTabProps {
  memberId: number;
}

const changeHistoryColumns = [
  {
    header: '변경 이력 ID',
    accessorKey: 'historyId'
  },
  {
    header: '회원 ID',
    accessorKey: 'memberId'
  },
  {
    header: '이전 이름',
    accessorKey: 'oldName'
  },
  {
    header: '새 이름',
    accessorKey: 'newName'
  },
  {
    header: '이전 생년월일/설립일',
    accessorKey: 'oldBirthOrEstablishmentDate',
    cell: ({ row }: any) => {
      const date = row?.original?.oldBirthOrEstablishmentDate;
      return date ? dayjs(date).format('YYYY-MM-DD') : '-';
    }
  },
  {
    header: '새 생년월일/설립일',
    accessorKey: 'newBirthOrEstablishmentDate',
    cell: ({ row }: any) => {
      const date = row?.original?.newBirthOrEstablishmentDate;
      return date ? dayjs(date).format('YYYY-MM-DD') : '-';
    }
  },
  {
    header: '이전 대표자명',
    accessorKey: 'oldRepresentativeName'
  },
  {
    header: '새 대표자명',
    accessorKey: 'newRepresentativeName'
  },
  {
    header: '이전 사업자등록번호',
    accessorKey: 'oldBusinessRegistrationNumber'
  },
  {
    header: '새 사업자등록번호',
    accessorKey: 'newBusinessRegistrationNumber'
  },
  {
    header: '변경일시',
    accessorKey: 'updatedAt',
    cell: ({ row }: any) => {
      const date = row?.original?.updatedAt;
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-';
    }
  }
];

export const ChangeHistoryTab: React.FC<ChangeHistoryTabProps> = ({
  memberId
}) => {
  const [changeHistoryPage, setChangeHistoryPage] = useState(1);
  const [changeHistoryPageSize, setChangeHistoryPageSize] = useState(10);

  const { data: memberChangeHistoryData } = useQuery({
    queryKey: [
      'member-change-history',
      memberId,
      changeHistoryPage,
      changeHistoryPageSize
    ],
    queryFn: () =>
      getMemberChangeHistory({
        memberId,
        page: changeHistoryPage - 1,
        size: changeHistoryPageSize
      }),
    placeholderData: previousData => previousData
  });

  const handleChangeHistoryTableChange = (page: number, pageSize: number) => {
    setChangeHistoryPage(page);
    setChangeHistoryPageSize(pageSize);
  };

  return (
    <Card title="기업정보 변경이력" className="mb-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {changeHistoryColumns.map(column => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!memberChangeHistoryData ? (
              <TableRow>
                <TableCell
                  colSpan={changeHistoryColumns.length}
                  className="text-center"
                >
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : memberChangeHistoryData.content.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={changeHistoryColumns.length}
                  className="text-center"
                >
                  기업정보 변경이력이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              memberChangeHistoryData.content.map(
                (row: MemberChangeHistory) => (
                  <TableRow key={row.historyId}>
                    {changeHistoryColumns.map(column => (
                      <TableCell key={column.accessorKey}>
                        {column.cell
                          ? column.cell({ row: { original: row } })
                          : row[
                              column.accessorKey as keyof MemberChangeHistory
                            ]}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
      {memberChangeHistoryData && memberChangeHistoryData.totalElements > 0 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={e => {
                    e.preventDefault();
                    if (changeHistoryPage > 1) {
                      handleChangeHistoryTableChange(
                        changeHistoryPage - 1,
                        changeHistoryPageSize
                      );
                    }
                  }}
                />
              </PaginationItem>
              {Array.from(
                {
                  length: Math.ceil(
                    memberChangeHistoryData.totalElements /
                      changeHistoryPageSize
                  )
                },
                (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={e => {
                        e.preventDefault();
                        handleChangeHistoryTableChange(
                          i + 1,
                          changeHistoryPageSize
                        );
                      }}
                      isActive={i + 1 === changeHistoryPage}
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
                      changeHistoryPage <
                      Math.ceil(
                        memberChangeHistoryData.totalElements /
                          changeHistoryPageSize
                      )
                    ) {
                      handleChangeHistoryTableChange(
                        changeHistoryPage + 1,
                        changeHistoryPageSize
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
