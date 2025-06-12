'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ko } from 'date-fns/locale';

export function ScheduleCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Sample data - in a real app, this would come from an API
  const scheduledContent = [
    {
      id: 1,
      title: '월간 뉴스레터',
      date: new Date(2024, 3, 1), // April 1, 2024
      type: '이메일'
    },
    {
      id: 2,
      title: '신제품 홍보 영상',
      date: new Date(2024, 3, 3), // April 3, 2024
      type: '비디오'
    },
    {
      id: 3,
      title: '봄 시즌 프로모션',
      date: new Date(2024, 3, 5), // April 5, 2024
      type: '이벤트'
    },
    {
      id: 4,
      title: '사용자 가이드 업데이트',
      date: new Date(2024, 3, 8), // April 8, 2024
      type: '문서'
    },
    {
      id: 5,
      title: '웨비나: 신기능 소개',
      date: new Date(2024, 3, 12), // April 12, 2024
      type: '비디오'
    },
    {
      id: 6,
      title: '고객 인터뷰',
      date: new Date(2024, 3, 15), // April 15, 2024
      type: '블로그'
    },
    {
      id: 7,
      title: '제품 업데이트 공지',
      date: new Date(2024, 3, 20), // April 20, 2024
      type: '뉴스'
    }
  ];

  // Function to check if a date has scheduled content
  const hasScheduledContent = (day: Date) => {
    return scheduledContent.some(
      content =>
        content.date.getDate() === day.getDate() &&
        content.date.getMonth() === day.getMonth() &&
        content.date.getFullYear() === day.getFullYear()
    );
  };

  // Function to get scheduled content for a specific day
  const getScheduledContentForDay = (day: Date) => {
    return scheduledContent.filter(
      content =>
        content.date.getDate() === day.getDate() &&
        content.date.getMonth() === day.getMonth() &&
        content.date.getFullYear() === day.getFullYear()
    );
  };

  // Get content for the selected date
  const selectedDateContent = date ? getScheduledContentForDay(date) : [];

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Select
              value={view}
              onValueChange={(value: 'month' | 'week' | 'day') =>
                setView(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="보기 방식" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">월별 보기</SelectItem>
                <SelectItem value="week">주별 보기</SelectItem>
                <SelectItem value="day">일별 보기</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={ko}
            className="rounded-md border"
            modifiers={{
              hasContent: day => hasScheduledContent(day)
            }}
            modifiersStyles={{
              hasContent: {
                fontWeight: 'bold',
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                color: 'hsl(var(--primary))'
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">
            {date ? (
              <time dateTime={date.toISOString()}>
                {date.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            ) : (
              '선택된 날짜 없음'
            )}
          </h3>

          {selectedDateContent.length > 0 ? (
            <div className="space-y-4">
              {selectedDateContent.map(content => (
                <div
                  key={content.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {content.date.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Badge variant="outline">{content.type}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">예정된 콘텐츠가 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
