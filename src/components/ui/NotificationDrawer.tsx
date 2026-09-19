'use client';

import React from 'react';
import { X, AlertTriangle, Package, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'High Mortality Alert',
      desc: 'Flock #FLOCK-2026-089 reported 18 mortality today (3.8% cumulative rate). Requires supervisor visit.',
      time: '15 mins ago',
      type: 'warning',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: '2',
      title: 'Feed Stock Threshold Reached',
      desc: 'Visakhapatnam Warehouse Pre-starter feed stock down to 45 bags (~2.25 Tons). Reorder requested.',
      time: '1 hour ago',
      type: 'inventory',
      icon: Package,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: '3',
      title: 'Trader Credit Limit Reached',
      desc: 'Trader Sri Ram Traders outstanding balance reached ₹250,000 (100% of approved credit line).',
      time: '3 hours ago',
      type: 'finance',
      icon: ShieldAlert,
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      id: '4',
      title: 'Expense Voucher Approved',
      desc: 'Supervisor diesel allowance request ₹4,200 approved by Branch Manager.',
      time: '5 hours ago',
      type: 'success',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Operational Alerts & Notifications</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div 
                key={n.id}
                className={`p-3.5 rounded-xl border ${n.color} transition-all hover:shadow-md cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-xs shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button className="text-xs font-semibold text-slate-600 hover:text-slate-900">
            Mark all as read
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
