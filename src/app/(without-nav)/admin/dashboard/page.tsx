import React from 'react';
import { Dashboard } from '@/components/admin/dashboard';

const DashboardPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">공지사항</h1>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
