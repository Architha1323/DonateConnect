'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 bg-background">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
