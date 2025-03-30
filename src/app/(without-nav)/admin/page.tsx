import type { Metadata } from 'next';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { RecentContent } from '@/components/admin/recent-content';
import { UpcomingSchedule } from '@/components/admin/upcoming-schedule';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Content management and scheduling dashboard'
};

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
      </div>
      <DashboardStats />
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingSchedule />
        <RecentContent />
      </div>
    </div>
  );
}
