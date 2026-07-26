'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          {children}
        </div>
      </div>
    </div>
  );
}
