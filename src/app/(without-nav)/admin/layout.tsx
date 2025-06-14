import type React from 'react';
import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRole } from '@/shared/api/common';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Content management and scheduling dashboard'
};

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookie = cookies().get('token')?.value ?? null;

  const hasPermission = await getRole(cookie);

  if (!(hasPermission?.data === 'ADMIN')) {
    redirect('/');
  }
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
