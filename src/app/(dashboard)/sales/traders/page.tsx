'use client';

import React, { useEffect, useState } from 'react';
import { PhoneCall, Plus, DollarSign } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function TradersPage() {
  const [traders, setTraders] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/sales/traders')
      .then((data: any) => setTraders(data))
      .catch(() => {
        setTraders([
          {
            id: '1',
            trader_code: 'TRD-1001',
            trader_name: 'Anakapalle Chicken Traders',
            mobile: '+91-9848022334',
            credit_limit: 1000000.0,
            current_balance: 250000.0,
            status: 'ACTIVE'
          }
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Trader Management & Ledgers</h2>
          <p className="text-xs text-slate-500 mt-1">Track wholesale bird traders, credit limits, debit sales, credit payments, and outstanding balance.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Trader</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Trader Code</th>
                <th className="p-3">Trader Name</th>
                <th className="p-3">Mobile</th>
                <th className="p-3 text-right">Credit Limit</th>
                <th className="p-3 text-right">Current Outstanding Balance</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {traders.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-emerald-700">{t.trader_code}</td>
                  <td className="p-3 font-bold text-slate-900">{t.trader_name}</td>
                  <td className="p-3 font-mono">{t.mobile}</td>
                  <td className="p-3 text-right">₹{t.credit_limit.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-purple-700">₹{t.current_balance.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
