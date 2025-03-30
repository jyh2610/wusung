import { ScheduleCalendar } from '@/components/admin/schedule-calendar';
import { ScheduleActions } from '@/components/admin/schedule-actions';
import { ProgramComponent } from '@/entities';

export default function SchedulePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">콘텐츠 스케줄</h1>
        <ScheduleActions />
      </div>
      {/* <ScheduleCalendar /> */}
      <ProgramComponent />
    </div>
  );
}
