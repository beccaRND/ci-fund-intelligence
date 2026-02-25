'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import LoginGate from '@/components/auth/LoginGate';
import GuidedTour, { useTour } from '@/components/tour/GuidedTour';

function AppContent({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { showTour, startTour, endTour } = useTour();

  return (
    <div className="min-h-screen flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[260px]'
        }`}
      >
        <Header
          showMenuButton
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onStartTour={startTour}
        />

        <main className="flex-1 px-8 py-8 max-w-[1280px] w-full mx-auto">
          {children}
        </main>

        <Footer />
      </div>

      <GuidedTour active={showTour} onEnd={endTour} />
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginGate>
      <AppContent>{children}</AppContent>
    </LoginGate>
  );
}
