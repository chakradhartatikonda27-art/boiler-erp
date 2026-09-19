'use client';

import React from 'react';
import { Smartphone, ClipboardList, AlertTriangle, Package, Pill, DollarSign, Home, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function MobileSupervisorPage() {
  const quickActions = [
    { title: "Today's Daily Report", desc: 'Record feed, mortality & body weight', href: '/operations/daily-reports', icon: ClipboardList, color: 'bg-emerald-600 text-white' },
    { title: 'Log Mortality', desc: 'Enter dead bird count & image notes', href: '/operations/daily-reports', icon: AlertTriangle, color: 'bg-red-600 text-white' },
    { title: 'Record Feed Intake', desc: 'Log 50kg feed bags used', href: '/operations/daily-reports', icon: Package, color: 'bg-blue-600 text-white' },
    { title: 'Medicine Usage', desc: 'Record vaccines & vitamins given', href: '/operations/daily-reports', icon: Pill, color: 'bg-purple-600 text-white' },
    { title: 'Submit Expense', desc: 'Log feed unloading / labour bills', href: '/finance/expenses', icon: DollarSign, color: 'bg-amber-600 text-white' },
    { title: 'Inspect Farm Details', desc: 'Sri Venkateswara Farm (Day 37)', href: '/operations/farms', icon: Home, color: 'bg-slate-800 text-white' },
  ];

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Mobile Card Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Supervisor Mobile Hub</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-extrabold rounded text-[10px]">FIELD MODE</span>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-400 text-[10px]">Assigned Farm</div>
            <div className="font-bold text-white">Sri Venkateswara Farm</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-[10px]">Flock Status</div>
            <div className="font-bold text-emerald-400">Day 37 (4,820 Birds)</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider px-1">Quick Supervisor Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((act, i) => {
            const Icon = act.icon;
            return (
              <Link
                key={i}
                href={act.href}
                className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div className={`p-3 rounded-xl ${act.color} shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">{act.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
