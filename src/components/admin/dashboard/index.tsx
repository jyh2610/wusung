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
import { Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { message } from 'antd';
import { format } from 'date-fns';
import { IDashboard } from './type';
import { Upload } from './ui/upload';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

function TableSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 7 }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

const getTagVariant = (tag: string) => {
  switch (tag.toUpperCase()) {
    case 'HWP':
      return 'default';
    case 'FAQ':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getTagColor = (tag: string) => {
  switch (tag.toUpperCase()) {
    case 'HWP':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'FAQ':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return '';
  }
};

export const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<
    number | null
  >(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', currentPage, pageSize],
    queryFn: () => getDashboard({ page: currentPage, size: pageSize }),
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const handleDelete = async (announcementId: number) => {
    setSelectedAnnouncementId(announcementId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAnnouncementId) return;

    try {
      await deleteDashboard(selectedAnnouncementId);
      message.success('공지사항이 성공적으로 삭제되었습니다.');
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (error) {
      message.error('공지사항 삭제 중 오류가 발생했습니다.');
    }
    setIsDeleteModalOpen(false);
    setSelectedAnnouncementId(null);
  };

  const filteredDashboard = dashboardData?.content?.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayData = search ? filteredDashboard : dashboardData?.content;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isUploadOpen) {
    return <Upload onCancel={() => setIsUploadOpen(false)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="공지사항 검색"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(0); // 검색 시 첫 페이지로 이동
          }}
          className="max-w-sm bg-white"
        />
        <Button onClick={() => setIsUploadOpen(true)}>공지사항 등록</Button>
      </div>

      <div className="rounded-md border bg-[#FFFFFF]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>태그</TableHead>
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
            ) : displayData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  공지사항이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              displayData?.map((item: IDashboard) => (
                <TableRow
                  key={item.announcementId}
                  onClick={() =>
                    router.push(`/admin/dashboard/${item.announcementId}`)
                  }
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      {item.topExposureTag && (
                        <div>
                          <Badge
                            variant={getTagVariant(item.topExposureTag)}
                            className={getTagColor(item.topExposureTag)}
                          >
                            {item.topExposureTag}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
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
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(item.announcementId);
                        }}
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

      {/* 페이지네이션 */}
      {dashboardData && (
        <div className="flex flex-col items-center space-y-2 mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: dashboardData.totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(i)}
                  className="w-8 h-8"
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === dashboardData.totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>공지사항 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 이 공지사항을 삭제하시겠습니까?</p>
            <p className="text-sm text-red-500 mt-2">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
