import type React from 'react';
import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/admin-sidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Content management and scheduling dashboard'
};

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
