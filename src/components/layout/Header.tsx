'use client';

import { Bell, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export default function Header({ onMenuToggle, showMenuButton }: HeaderProps) {
  return (
    <header className="h-16 bg-ci-white border-b border-ci-gray-300/50 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-[var(--radius-md)] hover:bg-ci-gray-100 transition-colors lg:hidden"
          >
            <Menu size={20} className="text-ci-gray-700" />
          </button>
        )}
        <h1
          className="text-lg font-bold text-ci-charcoal"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Regenerative Fund for Nature
        </h1>
        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-ci-green-light text-ci-green-dark">
          Intelligence Platform
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-[var(--radius-md)] hover:bg-ci-gray-100 transition-colors">
          <Bell size={18} className="text-ci-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ci-orange" />
        </button>
        <button className="p-2 rounded-[var(--radius-md)] hover:bg-ci-gray-100 transition-colors">
          <Settings size={18} className="text-ci-gray-500" />
        </button>
      </div>
    </header>
  );
}
