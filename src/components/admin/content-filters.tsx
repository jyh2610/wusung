'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export function ContentFilters() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="콘텐츠 검색..." className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="콘텐츠 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 유형</SelectItem>
            <SelectItem value="blog">블로그</SelectItem>
            <SelectItem value="news">뉴스</SelectItem>
            <SelectItem value="event">이벤트</SelectItem>
            <SelectItem value="video">비디오</SelectItem>
            <SelectItem value="document">문서</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="published">게시됨</SelectItem>
            <SelectItem value="draft">초안</SelectItem>
            <SelectItem value="scheduled">예약됨</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Link href="/admin/content/upload">
        <Button>
          <Plus className="mr-2 h-4 w-4" />새 콘텐츠
        </Button>
      </Link>
    </div>
  );
}
