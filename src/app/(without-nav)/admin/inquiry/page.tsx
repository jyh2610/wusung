'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInquiryList } from '@/components/admin/personal/api';
import { IInquiry } from '@/components/admin/personal/type';
import { Table } from 'antd';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function InquiryListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('ALL');
  const [memberId, setMemberId] = useState<number>();

  useEffect(() => {
    const memberIdParam = searchParams.get('memberId');
    if (memberIdParam) {
      setMemberId(Number(memberIdParam));
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['inquiry-list', page, size, search, type, memberId],
    queryFn: () => getInquiryList(page, size, memberId)
  });

  const columns = [
    {
      title: '문의 ID',
      dataIndex: 'inquiryId',
      key: 'inquiryId'
    },
    {
      title: '회원 ID',
      dataIndex: 'memberId',
      key: 'memberId'
    },
    {
      title: '문의 유형',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '답변 여부',
      dataIndex: 'haveToReadByAdmin',
      key: 'haveToReadByAdmin',
      render: (haveToReadByAdmin: boolean) => (
        <span className={haveToReadByAdmin ? 'text-green-600' : 'text-red-600'}>
          {haveToReadByAdmin ? '답변완료' : '답변대기'}
        </span>
      )
    },
    {
      title: '작성일',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">1:1 문의 관리</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg">
        <div className="space-y-2">
          <Label>검색</Label>
          <Input
            placeholder="제목, 내용"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>회원 ID</Label>
          <Input
            type="number"
            placeholder="회원 ID 입력"
            value={memberId || ''}
            onChange={e =>
              setMemberId(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        {/* <div className="space-y-2">
          <Label>문의 유형</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full h-10 bg-white border-2 border-gray-200 hover:border-blue-500 focus:border-blue-500 transition-colors">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="hover:bg-blue-50">
                전체
              </SelectItem>
              <SelectItem value="GENERAL" className="hover:bg-blue-50">
                일반문의
              </SelectItem>
              <SelectItem value="TECHNICAL" className="hover:bg-blue-50">
                기술문의
              </SelectItem>
              <SelectItem value="BILLING" className="hover:bg-blue-50">
                결제문의
              </SelectItem>
              <SelectItem value="OTHER" className="hover:bg-blue-50">
                기타
              </SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <Table
        columns={columns}
        dataSource={data?.data.content as unknown as IInquiry[]}
        rowKey="inquiryId"
        pagination={{
          total: data?.data.totalElements || 0,
          pageSize: size,
          current: page + 1,
          onChange: page => setPage(page - 1)
        }}
        loading={isLoading}
        onRow={record => ({
          onClick: () => router.push(`/admin/inquiry/${record.inquiryId}`),
          style: { cursor: 'pointer' }
        })}
      />
    </div>
  );
}
