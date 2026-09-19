'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Home, Bird, ClipboardList, AlertTriangle, 
  Package, Truck, DollarSign, Calculator, FileText, Settings, ShieldCheck, 
  PhoneCall, Smartphone, ShoppingCart
} from 'lucide-react';

interface NavSection {
  title: string;
  items: { name: string; href: string; icon: React.ElementType }[];
}

export default function Sidebar() {
  const pathname = usePathname();

  const navSections: NavSection[] = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { name: 'Farmers', href: '/operations/farmers', icon: Users },
        { name: 'Farms & Sheds', href: '/operations/farms', icon: Home },
        { name: 'Flocks Placement', href: '/operations/flocks', icon: Bird },
        { name: 'Daily Reports', href: '/operations/daily-reports', icon: ClipboardList }
      ]
    },
    {
      title: 'PROCUREMENT',
      items: [
        { name: 'Hatcheries & Chicks', href: '/procurement', icon: ShoppingCart }
      ]
    },
    {
      title: 'INVENTORY',
      items: [
        { name: 'Feed & Medicine Stock', href: '/inventory', icon: Package }
      ]
    },
    {
      title: 'SALES & LIFTING',
      items: [
        { name: 'Bird Availability', href: '/sales/availability', icon: Bird },
        { name: 'Traders & Ledger', href: '/sales/traders', icon: PhoneCall },
        { name: 'Bird Lifting & Invoices', href: '/sales/lifting', icon: Truck }
      ]
    },
    {
      title: 'FINANCE & CALCULATIONS',
      items: [
        { name: 'Expenses & Approvals', href: '/finance/expenses', icon: DollarSign },
        { name: 'Growing Charges Engine', href: '/finance/growing-charges', icon: Calculator }
      ]
    },
    {
      title: 'REPORTS & AUDIT',
      items: [
        { name: 'Exportable Reports', href: '/reports', icon: FileText },
        { name: 'User & System Admin', href: '/administration', icon: Settings }
      ]
    },
    {
      title: 'FIELD EXPERIENCE',
      items: [
        { name: 'Mobile Supervisor App', href: '/mobile', icon: Smartphone }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 bg-slate-950 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          BP
        </div>
        <div>
          <h1 className="font-bold text-white text-sm tracking-wide">BroilerCorp ERP</h1>
          <p className="text-xs text-slate-400">Poultry Integration Suite</p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <p className="px-3 text-[11px] font-semibold text-slate-500 tracking-wider mb-2">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Online</span>
        </div>
        <span className="text-slate-500">v1.0.0</span>
      </div>
    </aside>
  );
}
