'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Upload,
  Settings,
  LogOut,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminSidebar() {
  const pathname = usePathname();

  const routes = [
    // {
    //   label: "대시보드",
    //   icon: LayoutDashboard,
    //   href: "/admin",
    //   active: pathname === "/admin",
    // },
    {
      label: '콘텐츠 관리',
      icon: FileText,
      href: '/admin/content',
      active: pathname === '/admin/content'
    },
    {
      label: '콘텐츠 업로드',
      icon: Upload,
      href: '/admin/content/upload',
      active: pathname === '/admin/content/upload'
    },
    {
      label: '스케줄 관리',
      icon: Calendar,
      href: '/admin/schedule',
      active: pathname === '/admin/schedule'
    },
    {
      label: '회원 관리',
      icon: Users,
      href: '/admin/member',
      active: pathname === '/admin/member'
    }
    // {
    //   label: "설정",
    //   icon: Settings,
    //   href: "/admin/settings",
    //   active: pathname === "/admin/settings",
    // },
  ];

  return (
    <div className="h-screen w-64 border-r bg-background flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">관리자</h1>
      </div>
      <div className="flex-1 px-3 py-2 space-y-1">
        {routes.map(route => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md transition-colors',
              route.active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="p-4 mt-auto border-t">
        <Button variant="outline" className="w-full justify-start" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
