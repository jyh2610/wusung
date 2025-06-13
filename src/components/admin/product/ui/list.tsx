'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { IProduct } from '../type';
import { Table, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ListProps {
  products: IProduct[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (product: IProduct) => void;
  onDelete: (productId: number) => void;
  isLoading: boolean;
}

export const List = ({
  products,
  totalElements,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  isLoading
}: ListProps) => {
  const router = useRouter();

  const handleEdit = (product: IProduct) => {
    router.push(`/admin/product/${product.productId}`);
  };

  const handleDelete = (productId: number) => {
    Modal.confirm({
      title: '상품 삭제',
      content: '정말로 이 상품을 삭제하시겠습니까?',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        onDelete(productId);
      }
    });
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: '상품명',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '기간(개월)',
      dataIndex: 'periodMonths',
      key: 'periodMonths',
      render: (periodMonths: number) => `${periodMonths}개월`
    },
    {
      title: '가격',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => `${price.toLocaleString()}원`
    },
    {
      title: '상태',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (active ? '활성' : '비활성')
    },
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(record)}
          >
            상세보기
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(record.productId)}
          >
            삭제
          </Button>
        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="productId"
      pagination={{
        total: totalElements,
        pageSize,
        current: currentPage + 1,
        onChange: page => onPageChange(page - 1)
      }}
      loading={isLoading}
    />
  );
};
