'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFamilyList, deleteFamily } from './api';
import { IFamily } from './type';
import { message } from 'antd';
import { Upload } from './ui/upload';
import { Edit } from './ui/edit';

export const Family = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [isUploading, setIsUploading] = useState(false);
  const [editingFamily, setEditingFamily] = useState<IFamily | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['family', page, size],
    queryFn: () => getFamilyList(page, size)
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteFamily(id);
      message.success('패밀리 사이트가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['family'] });
      queryClient.refetchQueries({ queryKey: ['family'] });
    } catch (error) {
      message.error('패밀리 사이트 삭제 중 오류가 발생했습니다.');
    }
  };

  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '링크',
      dataIndex: 'link',
      key: 'link',
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      )
    },
    {
      title: '상태',
      dataIndex: 'isVisible',
      key: 'isVisible',
      render: (isVisible: boolean) => (isVisible ? '활성' : '비활성')
    },
    {
      title: '관리',
      key: 'action',
      render: (_: any, record: IFamily) => (
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingFamily(record)}
          >
            수정
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(record.partnerId)}
          >
            삭제
          </Button>
        </div>
      )
    }
  ];

  if (isUploading) {
    return <Upload onCancel={() => setIsUploading(false)} />;
  }

  if (editingFamily) {
    return (
      <Edit family={editingFamily} onCancel={() => setEditingFamily(null)} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">패밀리 사이트 관리</h1>
        <Button onClick={() => setIsUploading(true)}>패밀리 사이트 등록</Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data.content as unknown as IFamily[]}
        rowKey="id"
        pagination={{
          total: data?.data.totalElements || 0,
          pageSize: size,
          current: page + 1,
          onChange: page => setPage(page - 1)
        }}
        loading={isLoading}
      />
    </div>
  );
};
