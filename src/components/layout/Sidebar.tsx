'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  MapPin,
  Upload,
  Mountain,
  Info,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  User,
} from 'lucide-react';
import { projects } from '@/lib/seed/projects';
import { commodityColor } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: BarChart3 },
    { href: '/projects', label: 'Projects', icon: MapPin, expandable: true },
    { href: '/landscape', label: 'Landscape Analysis', icon: Mountain },
  ];

  const infoItems = [
    { href: '#', label: 'About the Fund', icon: Info },
    { href: '#', label: 'Partnership Tiers', icon: TrendingUp },
    { href: '#', label: 'CI Annual Report', icon: ExternalLink },
  ];

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-ci-white border-r border-ci-gray-300/50 z-30 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-ci-gray-300/50 shrink-0">
        <div className="w-8 h-8 rounded-full bg-ci-green flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            CI
          </span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-ci-charcoal leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Fund Intelligence
            </div>
            <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider leading-tight">
              Regenerative Fund
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-colors group ${
                    active
                      ? 'bg-ci-green-light text-ci-green-dark font-semibold'
                      : 'text-ci-gray-700 hover:bg-ci-gray-100'
                  }`}
                  onClick={(e) => {
                    if (item.expandable) {
                      e.preventDefault();
                      if (!collapsed) setProjectsOpen(!projectsOpen);
                    }
                  }}
                >
                  <Icon size={20} className={active ? 'text-ci-green' : 'text-ci-gray-500 group-hover:text-ci-gray-700'} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                        {item.label}
                      </span>
                      {item.expandable && (
                        <span className="text-ci-gray-500">
                          {projectsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      )}
                    </>
                  )}
                </Link>

                {/* Project sub-nav */}
                {item.expandable && projectsOpen && !collapsed && (
                  <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-ci-gray-100 pl-3">
                    {projects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.id}`}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] text-xs transition-colors ${
                          pathname === `/projects/${p.id}`
                            ? 'bg-ci-green-light text-ci-green-dark font-medium'
                            : 'text-ci-gray-500 hover:text-ci-gray-700 hover:bg-ci-gray-100'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: commodityColor(p.commodity) }}
                        />
                        <span className="truncate">{p.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info section */}
        {!collapsed && (
          <div className="mt-8">
            <div className="px-3 mb-2 text-[10px] font-semibold text-ci-gray-500 uppercase tracking-wider">
              Fund Info
            </div>
            <div className="space-y-1">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-ci-gray-500 hover:bg-ci-gray-100 hover:text-ci-gray-700 transition-colors"
                  >
                    <Icon size={18} />
                    <span className="text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-ci-gray-300/50 p-3 shrink-0">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-ci-green-light flex items-center justify-center">
              <User size={16} className="text-ci-green" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ci-green-light flex items-center justify-center shrink-0">
              <User size={16} className="text-ci-green" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-ci-charcoal truncate">Jim Fitzpatrick</div>
              <div className="text-[11px] text-ci-gray-500 truncate">Director, Regen Fund</div>
            </div>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-ci-white border border-ci-gray-300 flex items-center justify-center shadow-sm hover:bg-ci-gray-100 transition-colors z-40"
      >
        {collapsed ? <PanelLeft size={12} className="text-ci-gray-500" /> : <PanelLeftClose size={12} className="text-ci-gray-500" />}
      </button>
    </aside>
  );
}
