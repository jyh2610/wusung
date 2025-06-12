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
import { useEffect, useState } from 'react';
import { getCategoryList } from './api';
import { ICategory } from '@/shared/type';

export function ContentFilters() {
  const [list, setList] = useState<ICategory[]>([]);

  useEffect(() => {
    const getList = async () => {
      const res = await getCategoryList();
      res && setList(res);
    };
    getList();
  }, []);

  return (
    <div className="rounded-md border bg-[#FFFFFF] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            {list.map(item => (
              <SelectItem key={item.categoryId} value={item.categoryId + ''}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="난이도" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'1'}>하</SelectItem>
            <SelectItem value={'2'}>중</SelectItem>
            <SelectItem value={'3'}>상</SelectItem>
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
