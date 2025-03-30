import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function ScheduleActions() {
  return (
    <div className="flex gap-2">
      <Link href="/admin/content/upload">
        <Button>
          <Plus className="mr-2 h-4 w-4" />새 콘텐츠 예약
        </Button>
      </Link>
    </div>
  );
}
