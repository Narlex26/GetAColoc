import type { ReactNode } from 'react';
import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
