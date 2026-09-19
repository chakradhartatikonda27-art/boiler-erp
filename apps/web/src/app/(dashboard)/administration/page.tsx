'use client';

import React, { useEffect, useState } from 'react';
import { Settings, ShieldCheck, FileText, UserPlus } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function AdministrationPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/audit/logs')
      .then((data: any) => setAuditLogs(data))
      .catch(() => {
        setAuditLogs([
          {
            id: 'l1',
            user_email: 'admin@example.com',
            action: 'SYSTEM_INIT',
            module: 'SYSTEM',
            created_at: '2026-09-19T00:00:00'
          },
          {
            id: 'l2',
            user_email: 'supervisor@example.com',
            action: 'DAILY_REPORT_SUBMITTED',
            module: 'FLOCK',
            created_at: '2026-09-19T08:30:00'
          }
        ]);
      });
  }, []);

  const usersList = [
    { email: 'admin@example.com', name: 'Rajesh Varma', role: 'ADMIN', status: 'ACTIVE' },
    { email: 'manager@example.com', name: 'Suresh Kumar', role: 'MANAGER', status: 'ACTIVE' },
    { email: 'supervisor@example.com', name: 'Venkatesh Rao', role: 'SUPERVISOR', status: 'ACTIVE' },
    { email: 'accountant@example.com', name: 'Anitha Sharma', role: 'ACCOUNTANT', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Administration & Audit Logs</h2>
          <p className="text-xs text-slate-500 mt-1">Manage user access roles, security credentials, system settings, and immutable audit logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Roles */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">System Users & RBAC Assignments</h3>
            <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create User</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-2.5">User Name</th>
                  <th className="p-2.5">Email</th>
                  <th className="p-2.5">Assigned Role</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {usersList.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-2.5 font-mono text-slate-600">{u.email}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{u.role}</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs Viewer */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Immutable Audit Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-2.5">User</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Module</th>
                  <th className="p-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {auditLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-700">{l.user_email}</td>
                    <td className="p-2.5 font-bold text-slate-900">{l.action}</td>
                    <td className="p-2.5 font-semibold text-blue-600">{l.module}</td>
                    <td className="p-2.5 text-slate-500 font-mono text-[10px]">{l.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
