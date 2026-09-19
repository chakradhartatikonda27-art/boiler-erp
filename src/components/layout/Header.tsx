'use client';

import React, { useState } from 'react';
import { Search, Bell, Shield, MapPin, UserCheck, ChevronDown, Check } from 'lucide-react';

export default function Header() {
  const [activeRole, setActiveRole] = useState<'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'ACCOUNTANT'>('ADMIN');
  const [selectedBranch, setSelectedBranch] = useState('Visakhapatnam Central (AP)');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roles = [
    { id: 'ADMIN', label: 'Admin (Full Access)', desc: 'System management & master configuration' },
    { id: 'MANAGER', label: 'Branch Manager', desc: 'Regional farm & supervisor oversight' },
    { id: 'SUPERVISOR', label: 'Field Supervisor', desc: 'Assigned farm daily reports & lifting' },
    { id: 'ACCOUNTANT', label: 'Finance Accountant', desc: 'Expenses, payments & growing charges' },
  ] as const;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Search & Location Scope */}
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Global search farmer, farm code, flock, trader..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Location Filter Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Branch:</span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent font-semibold border-none outline-none cursor-pointer text-slate-900"
          >
            <option value="Visakhapatnam Central (AP)">Visakhapatnam Central (AP)</option>
            <option value="Vijayawada North (AP)">Vijayawada North (AP)</option>
            <option value="Rajahmundry East (AP)">Rajahmundry East (AP)</option>
          </select>
        </div>
      </div>

      {/* Role Switcher & User Profile */}
      <div className="flex items-center gap-4">
        {/* Active Role Selector */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Role: {activeRole}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Simulate Role Access
              </div>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRole(r.id);
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-start justify-between group"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700">{r.label}</div>
                    <div className="text-[10px] text-slate-500">{r.desc}</div>
                  </div>
                  {activeRole === r.id && <Check className="w-4 h-4 text-emerald-600 mt-0.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
            RV
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">Rajesh Varma</div>
            <div className="text-[10px] text-slate-500">admin@example.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
