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
import { getMemberList } from '../api';
import { Member } from '../tpye';
import { PaginatedResponse } from '@/shared/type';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export function MemberList() {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: () =>
      getMemberList({
        page: 0,
        size: 10,
        sort: 'createdAt',
        direction: 'DESC',
        search: ''
      })
  });

  const handleRowClick = (memberId: number) => {
    router.push(`/admin/member/${memberId}`);
  };

  return (
    <div className="space-y-4">
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
            {data?.content?.length === 0 ? (
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
    </div>
  );
}
