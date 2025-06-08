'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPaymentList, getFilter, getSortList, approvePayment } from './api';
import { IPayment } from './type';
import { message } from 'antd';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

export const Payment = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [memberId, setMemberId] = useState<number>();
  const [status, setStatus] = useState<string>('ALL');
  const [isBankTransfer, setIsBankTransfer] = useState<boolean>();
  const [sort, setSort] = useState('createdAt');
  const [direction, setDirection] = useState<'ASC' | 'DESC'>('DESC');
  const queryClient = useQueryClient();

  const { data: filterOptions } = useQuery({
    queryKey: ['payment-filter'],
    queryFn: getFilter
  });

  const { data: sortOptions } = useQuery({
    queryKey: ['payment-sort'],
    queryFn: getSortList
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      'payment',
      page,
      size,
      search,
      memberId,
      status,
      isBankTransfer,
      sort,
      direction
    ],
    queryFn: () =>
      getPaymentList({
        page,
        limit: size,
        search,
        memberId,
        status: status === 'ALL' ? undefined : (status as any),
        isBankTransferPaymentMethod: isBankTransfer,
        sort: sort as any,
        direction
      })
  });

  const handleApprove = async (paymentId: number) => {
    try {
      await approvePayment(paymentId);
      message.success('결제가 승인되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      queryClient.refetchQueries({ queryKey: ['payment'] });
    } catch (error) {
      message.error('결제 승인 중 오류가 발생했습니다.');
    }
  };

  const columns = [
    {
      title: '결제 ID',
      dataIndex: 'paymentId',
      key: 'paymentId'
    },
    {
      title: '구매자',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '결제 금액',
      dataIndex: 'amountTotal',
      key: 'amountTotal',
      render: (amount: number) => `${amount.toLocaleString()}원`
    },
    {
      title: '결제 상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          PENDING: '대기중',
          PAID: '결제완료',
          CANCELLED: '취소됨',
          FAILED: '실패'
        };
        return statusMap[status] || status;
      }
    },
    {
      title: '결제 수단',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) =>
        method === 'BANK_TRANSFER' ? '무통장입금' : method
    },
    {
      title: '결제일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
    },
    {
      title: '관리',
      key: 'action',
      render: (_: any, record: IPayment) => (
        <div className="space-x-2">
          {record.status === 'PENDING' &&
            record.paymentMethod === 'BANK_TRANSFER' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(record.tradeId)}
              >
                승인
              </Button>
            )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">결제 관리</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg">
        <div className="space-y-2">
          <Label>검색</Label>
          <Input
            placeholder="구매자 이름, 이메일, 전화번호, 결제ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>회원 ID</Label>
          <Input
            type="number"
            placeholder="회원 ID"
            value={memberId}
            onChange={e =>
              setMemberId(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>결제 상태</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체</SelectItem>
              {filterOptions?.data.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>정렬</Label>
          <div className="flex space-x-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions?.data.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={direction} onValueChange={setDirection as any}>
              <SelectTrigger>
                <SelectValue placeholder="정렬 방향" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">오름차순</SelectItem>
                <SelectItem value="DESC">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isBankTransfer"
            checked={isBankTransfer}
            onCheckedChange={setIsBankTransfer}
            className="bg-gray-200 data-[state=checked]:bg-blue-600"
          />
          <Label htmlFor="isBankTransfer">무통장 입금만 보기</Label>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data.content as unknown as IPayment[]}
        rowKey="paymentId"
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
