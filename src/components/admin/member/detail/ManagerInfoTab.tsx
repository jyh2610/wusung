'use client';

import React from 'react';
import { Card } from 'antd';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getManagerList } from '@/components/admin/api';

interface ManagerInfoTabProps {
  memberId: number;
}

const managerColumns = [
  {
    header: '담당자 ID',
    accessorKey: 'managerId'
  },
  {
    header: '이름',
    accessorKey: 'name'
  },
  {
    header: '직급',
    accessorKey: 'jobGrade'
  },
  {
    header: '전화번호',
    accessorKey: 'phoneNumber'
  },
  {
    header: '이메일',
    accessorKey: 'email'
  },
  {
    header: '주소',
    accessorKey: 'address'
  },
  {
    header: '등록일',
    accessorKey: 'createdAt',
    cell: ({ row }: any) => {
      const date = row?.original?.createdAt;
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-';
    }
  }
];

export const ManagerInfoTab: React.FC<ManagerInfoTabProps> = ({ memberId }) => {
  const { data: managerListData } = useQuery({
    queryKey: ['member-manager-list', memberId],
    queryFn: () => getManagerList(memberId),
    placeholderData: previousData => previousData
  });

  return (
    <Card title="담당자 정보" className="mb-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {managerColumns.map(column => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!managerListData ? (
              <TableRow>
                <TableCell
                  colSpan={managerColumns.length}
                  className="text-center"
                >
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : !managerListData ||
              (Array.isArray(managerListData) &&
                managerListData.length === 0) ? (
              <TableRow>
                <TableCell
                  colSpan={managerColumns.length}
                  className="text-center"
                >
                  담당자 정보가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              (Array.isArray(managerListData)
                ? managerListData
                : [managerListData]
              ).map((row: any) => (
                <TableRow key={row.managerId}>
                  <TableCell>{row.managerId}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.jobGrade}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>
                    {dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
