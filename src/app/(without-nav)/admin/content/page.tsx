'use client';

import { ContentList } from '@/components/admin/content-list';
import { ContentFilters } from '@/components/admin/content-filters';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

export default function ContentPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">콘텐츠 관리</h1>
        <Button onClick={() => router.push('/admin/content/upload')}>
          콘텐츠 추가
        </Button>
      </div>
      <ContentList />
    </div>
  );
}
