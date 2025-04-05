import { ContentList } from '@/components/admin/content-list';
import { ContentFilters } from '@/components/admin/content-filters';

export default function ContentPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">콘텐츠 관리</h1>
      </div>
      <ContentFilters />
      <ContentList />
    </div>
  );
}
