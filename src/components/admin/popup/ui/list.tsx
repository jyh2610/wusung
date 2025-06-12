'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopup, deletePopup } from '../api';
import { Button } from '@/components/ui/button';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { IPopup } from '../tpye';

interface ListProps {
  onAdd: () => void;
}

export const List = ({ onAdd }: ListProps) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['popup', page],
    queryFn: () => getPopup(page, size)
  });

  const handleDelete = async (id: number) => {
    try {
      await deletePopup(id);
      message.success('팝업이 삭제되었습니다.');
      refetch();
    } catch (error) {
      message.error('팝업 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/popup/edit/${id}`);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">팝업 관리</h2>
        <Button onClick={onAdd}>팝업 등록</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                노출 기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.content.map((popup: IPopup) => (
              <tr key={popup.popupId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {popup.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(new Date(popup.startTime), 'yyyy.MM.dd', {
                      locale: ko
                    })}{' '}
                    ~{' '}
                    {format(new Date(popup.endTime), 'yyyy.MM.dd', {
                      locale: ko
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      popup.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {popup.isActive ? '노출' : '비노출'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(popup.popupId)}
                    className="mr-2"
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(popup.popupId)}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            이전
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.totalPages - 1}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
};
