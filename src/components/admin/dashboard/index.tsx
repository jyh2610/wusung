'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboard, deleteDashboard } from './api';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Trash2, Pencil } from 'lucide-react';
import { message } from 'antd';
import { format } from 'date-fns';
import { IDashboard } from './type';
import { Upload } from './ui/upload';
import { useRouter } from 'next/navigation';

function TableSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 6 }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard
  });

  const handleDelete = async (announcementId: number) => {
    try {
      await deleteDashboard(announcementId);
      message.success('공지사항이 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (error) {
      message.error('공지사항 삭제 중 오류가 발생했습니다.');
    }
  };

  const filteredDashboard = dashboardData?.content.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isUploadOpen) {
    return <Upload onCancel={() => setIsUploadOpen(false)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="공지사항 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm bg-white"
        />
        <Button onClick={() => setIsUploadOpen(true)}>공지사항 등록</Button>
      </div>

      <div className="rounded-md border bg-[#FFFFFF]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>조회수</TableHead>
              <TableHead>최상단 노출</TableHead>
              <TableHead>수정일</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableSkeleton key={index} />
              ))
            ) : filteredDashboard?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  공지사항이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredDashboard?.map((item: IDashboard) => (
                <TableRow
                  key={item.announcementId}
                  onClick={() =>
                    router.push(`/admin/dashboard/${item.announcementId}`)
                  }
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant={item.isVisible ? 'default' : 'secondary'}>
                      {item.isVisible ? '공개' : '비공개'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.views}</TableCell>
                  <TableCell>
                    <Badge variant={item.topExposure ? 'default' : 'secondary'}>
                      {item.topExposure ? '노출' : '미노출'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.updatedAt), 'yyyy.MM.dd')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/edit/${item.announcementId}`
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(item.announcementId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
