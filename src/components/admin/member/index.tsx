'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getMemberList, getMemberSortList } from '../api';
import { Member } from '../tpye';
import { PaginatedResponse } from '@/shared/type';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

dayjs.extend(relativeTime);
dayjs.locale('ko');

function TableSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 9 }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function MemberList() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('createdAt');
  const [direction, setDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState('');

  const { data: sortColumns } = useQuery({
    queryKey: ['member-sort-columns'],
    queryFn: getMemberSortList
  });

  const { data, isLoading } = useQuery({
    queryKey: ['members', page, size, sort, direction, search],
    queryFn: () =>
      getMemberList({
        page,
        size,
        sort,
        direction,
        search
      })
  });

  const handleRowClick = (memberId: number) => {
    router.push(`/admin/member/${memberId}`);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleDirectionChange = () => {
    setDirection(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0); // 검색 시 첫 페이지로 이동
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 bg-white">
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              {sortColumns?.map(column => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDirectionChange}
            className="h-10 w-10"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        <Input
          placeholder="아이디, 이름, 이메일, 전화번호를 입력하세요"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="max-w-sm bg-white"
        />
      </div>

      <div className="rounded-md border bg-[#FFFFFF]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>아이디</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>유형</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>탈퇴여부</TableHead>
              <TableHead>VIP</TableHead>
              <TableHead>구독 만료일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableSkeleton key={index} />
              ))
            ) : data?.content?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  회원이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.content?.map(member => (
                <TableRow
                  key={member.memberId}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(member.memberId)}
                >
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.userType}</TableCell>
                  <TableCell>{member.phoneNumber}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.createdAt?.slice(0, 10)}</TableCell>
                  <TableCell>{member.isWithdrawn ? '탈퇴' : '정상'}</TableCell>
                  <TableCell>{member.isVip ? 'VIP' : '-'}</TableCell>
                  <TableCell>
                    {member.subscriptionEndDate ? (
                      <div className="flex items-center gap-2">
                        <span>
                          {dayjs(member.subscriptionEndDate).format(
                            'YYYY-MM-DD'
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({dayjs(member.subscriptionEndDate).fromNow()})
                        </span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">페이지 크기:</span>
          <Select
            value={size.toString()}
            onValueChange={value => setSize(Number(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="페이지 크기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
            disabled={page === 0}
          >
            이전
          </Button>
          <span className="text-sm">
            {page + 1} / {Math.ceil((data?.totalElements || 0) / size)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(prev => prev + 1)}
            disabled={!data?.last}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
