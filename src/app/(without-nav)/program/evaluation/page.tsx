'use client';

import { IContent, IContentList } from '@/entities/program/type.dto';
import { DashBoard } from '@/shared';
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';
import React, { useEffect, useState } from 'react';
import { fetchEvaluationContentsOnly, getContentList } from './utils';
import {
  TableRow,
  TableCell,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { getNotokenSubscription } from '@/entities/UserManage/api';
import { useQuery } from '@tanstack/react-query';

const columns = [
  { id: 'title', label: '제목', align: 'left' as const },
  { id: 'date', label: '날짜', align: 'right' as const },
  { id: 'viewCount', label: '조회수', align: 'right' as const }
];

function Evaluation() {
  const categoryIndividualList =
    useCategoryTreeStore.getState().categoryIndividualList;
  const { selectedCategoryNode } = useCategoryTreeStore();
  const [page, setPage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;

  const router = useRouter();
  const pathname = usePathname();

  const { data: contentData, isLoading } = useQuery({
    queryKey: ['evaluationContents', selectedCategoryNode?.categoryId, page],
    queryFn: async () => {
      if (!selectedCategoryNode) return null;
      const result = await getContentList({
        categoryId: selectedCategoryNode.categoryId,
        page: page,
        size: pageSize
      });
      return result.data.data;
    },
    enabled: !!selectedCategoryNode
  });

  useEffect(() => {
    const checkSubscription = async () => {
      const subscription = await getNotokenSubscription();
      if (!subscription?.data?.isVip) {
        setIsModalOpen(true);
      }
    };
    checkSubscription();
  }, [router]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/program');
  };

  const handleClick = (id: string) => {
    const currentPath = pathname.replace(/\/$/, '');
    router.push(`${currentPath}/${id}`);
  };

  const renderRow = (row: IContentList) => (
    <TableRow
      key={row.title}
      hover
      sx={{ cursor: 'pointer' }}
      onClick={() => handleClick(row.eduContentId + '')}
    >
      <TableCell align="left">{row.title}</TableCell>
      <TableCell align="right">{`${row.year}-${row.month}`}</TableCell>
      <TableCell align="right">{row.viewCount}</TableCell>
    </TableRow>
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1);
  };

  return (
    <div>
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>접근 권한 없음</DialogTitle>
        <DialogContent>
          <p>VIP 회원만 이용할 수 있는 서비스입니다.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
      <p
        style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '24px',
          color: '#333',
          padding: '16px 0',
          borderBottom: '2px solid #eee'
        }}
      >
        {selectedCategoryNode?.name}
      </p>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <DashBoard
          columns={columns}
          renderRow={renderRow}
          rows={contentData?.content.flat() || []}
        />
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <Pagination
          count={contentData?.totalPages || 0}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
}

export default Evaluation;
