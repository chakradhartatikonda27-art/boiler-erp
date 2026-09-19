'use client';

import React from 'react';
import { ShoppingCart, Plus, Building, Truck } from 'lucide-react';

export default function ProcurementPage() {
  const hatcheries = [
    { name: 'Venkateshwara Hatcheries Pvt Ltd', contact: 'Ramesh Reddy', mobile: '+91-9123456789', status: 'ACTIVE' },
    { name: 'Suguna Foods Hatchery Division', contact: 'Kiran Naidu', mobile: '+91-9123456780', status: 'ACTIVE' },
  ];

  const purchases = [
    { date: '2026-08-13', batch: 'BATCH-2026-08A', hatchery: 'Venkateshwara Hatcheries', qty: 5000, unitCost: 32.0, total: 160000.0 },
    { date: '2026-08-30', batch: 'BATCH-2026-09B', hatchery: 'Suguna Foods', qty: 6000, unitCost: 31.5, total: 189000.0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Procurement & Hatchery Management</h2>
          <p className="text-xs text-slate-500 mt-1">Manage vendor hatcheries, chick purchases, transport costs, and batch traceability.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Chick Purchase</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Chick Purchases & Batch Origin Traceability</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Purchase Date</th>
                <th className="p-3">Batch Number</th>
                <th className="p-3">Hatchery Vendor</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Chick Rate (₹)</th>
                <th className="p-3 text-right">Total Purchase Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {purchases.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">{row.date}</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">{row.batch}</td>
                  <td className="p-3">{row.hatchery}</td>
                  <td className="p-3 text-right font-bold">{row.qty.toLocaleString()}</td>
                  <td className="p-3 text-right">₹{row.unitCost.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-slate-900">₹{row.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
