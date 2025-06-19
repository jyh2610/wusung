'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getScheduleList, ISchedule } from '@/entities/program/api';
import { colors } from '@/design-tokens';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/shared/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteSchedule } from '@/components/admin/api';
import { toast } from 'react-toastify';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    return currentMonth === 12
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const currentMonth = new Date().getMonth() + 2;
    return currentMonth === 12 ? 1 : currentMonth;
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(2);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 10;

  // URL 쿼리 파라미터로 초기값 설정
  useEffect(() => {
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const difficulty = searchParams.get('difficulty');

    if (year) setSelectedYear(Number(year));
    if (month) setSelectedMonth(Number(month));
    if (difficulty) setSelectedDifficulty(Number(difficulty));
  }, [searchParams]);

  // URL 쿼리 파라미터 업데이트
  const updateQueryParams = (
    year: number,
    month: number,
    difficulty: number
  ) => {
    const params = new URLSearchParams();
    params.set('year', year.toString());
    params.set('month', month.toString());
    params.set('difficulty', difficulty.toString());
    router.push(`?${params.toString()}`);
  };

  // 스케줄 데이터 가져오기
  const { data: schedules, refetch } = useQuery({
    queryKey: [
      'schedules',
      selectedYear,
      selectedMonth,
      selectedDifficulty,
      currentPage
    ],
    queryFn: () =>
      getScheduleList({
        year: selectedYear,
        month: selectedMonth,
        difficultyLevel: selectedDifficulty,
        page: currentPage,
        size: pageSize
      })
  });

  const handleDifficultyChange = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    setCurrentPage(0);
    updateQueryParams(selectedYear, selectedMonth, difficulty);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setCurrentPage(0);
    updateQueryParams(year, selectedMonth, selectedDifficulty);
  };

  const handleMonthChange = (month: number) => {
    if (selectedMonth === 12 && month === 1) {
      setSelectedYear(selectedYear + 1);
    } else if (selectedMonth === 1 && month === 12) {
      setSelectedYear(selectedYear - 1);
    }
    setSelectedMonth(month);
    setCurrentPage(0);
    updateQueryParams(selectedYear, month, selectedDifficulty);
  };

  const formatDate = (year: number, month: number) => {
    return new Date(year, month - 1, 1).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          backgroundColor: colors.gray_scale['default'],
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                년도
              </label>
              <select
                value={selectedYear}
                onChange={e => handleYearChange(Number(e.target.value))}
                style={{
                  width: '120px',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() - 2 + i
                ).map(year => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                월
              </label>
              <select
                value={selectedMonth}
                onChange={e => handleMonthChange(Number(e.target.value))}
                style={{
                  width: '120px',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                난이도
              </label>
              <select
                value={selectedDifficulty}
                onChange={e => handleDifficultyChange(Number(e.target.value))}
                style={{
                  width: '120px',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                <option value={1}>상</option>
                <option value={2}>중</option>
                <option value={3}>하</option>
              </select>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              width: '140px',
              height: '57px'
            }}
          >
            <Button
              content="+ 스케줄 추가"
              type="default"
              onClick={() => router.push('/admin/schedule')}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px'
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>스케줄 ID</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>난이도</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>수정일</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!schedules?.content || schedules.content.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  style={{ textAlign: 'center', padding: '48px 0' }}
                >
                  스케줄이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              schedules.content.map((schedule: ISchedule) => (
                <TableRow key={schedule.scheduleId}>
                  <TableCell>{schedule.scheduleId}</TableCell>
                  <TableCell>
                    {formatDate(schedule.year, schedule.month)}
                  </TableCell>
                  <TableCell>
                    {schedule.difficultyLevel === 1
                      ? '상'
                      : schedule.difficultyLevel === 2
                        ? '중'
                        : '하'}
                  </TableCell>
                  <TableCell>
                    {new Date(schedule.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    {new Date(schedule.updatedAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        content="수정"
                        type="borderBrand"
                        onClick={() =>
                          router.push(
                            `/admin/schedule?difficultyid=${schedule.difficultyLevel}&year=${schedule.year}&month=${schedule.month}&scheduleId=${schedule.scheduleId}`
                          )
                        }
                      />
                      <Button
                        content="삭제"
                        type="borderBrand"
                        onClick={async () => {
                          if (window.confirm('정말 삭제하시겠습니까?')) {
                            try {
                              await deleteSchedule(schedule.scheduleId);
                              toast.success('삭제되었습니다.');
                              refetch();
                            } catch (error) {
                              toast.error('삭제에 실패했습니다.');
                            }
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        {schedules && schedules.totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px'
            }}
          >
            <Button
              content="이전"
              type="borderBrand"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            />
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px'
              }}
            >
              {currentPage + 1} / {schedules.totalPages}
            </span>
            <Button
              content="다음"
              type="borderBrand"
              onClick={() =>
                setCurrentPage(prev =>
                  Math.min(schedules.totalPages - 1, prev + 1)
                )
              }
              disabled={currentPage === schedules.totalPages - 1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
