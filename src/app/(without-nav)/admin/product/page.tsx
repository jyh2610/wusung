'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { message } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProduct, deleteProduct } from '@/components/admin/product/api';
import { IProduct } from '@/components/admin/product/type';
import { List } from '@/components/admin/product/ui/list';
import { Upload } from '@/components/admin/product/ui/upload';

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['product', page, size],
    queryFn: () => getProduct(page, size)
  });

  const handleEdit = (product: IProduct) => {
    router.push(`/admin/product/edit/${product.productId}`);
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      message.success('상품이 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['product'] });
    } catch (error) {
      message.error('상품 삭제 중 오류가 발생했습니다.');
    }
  };

  if (isUploading) {
    return <Upload onCancel={() => setIsUploading(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Button onClick={() => setIsUploading(true)}>상품 등록</Button>
      </div>

      <List
        products={data?.content || []}
        totalElements={data?.totalElements || 0}
        totalPages={data?.totalPages || 0}
        currentPage={page}
        pageSize={size}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Page;
