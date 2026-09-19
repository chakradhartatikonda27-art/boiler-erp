'use client';

import React, { useState } from 'react';
import { Package, ArrowRightLeft, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function InventoryPage() {
  const feedStock = [
    { type: 'Pre-Starter Feed', location: 'Godown Central', bags: 120, kg: 6000, status: 'AVAILABLE' },
    { type: 'Starter Feed', location: 'Sri Venkateswara Farm', bags: 180, kg: 9000, status: 'AVAILABLE' },
    { type: 'Grower Feed', location: 'Laxmi Green Farm', bags: 140, kg: 7000, status: 'AVAILABLE' },
    { type: 'Finisher Feed', location: 'Godown Central', bags: 40, kg: 2000, status: 'LOW_STOCK' },
  ];

  const medicineBatches = [
    { name: 'Vimeral Multivitamin', batch: 'VIM-2026-04', expiry: '2026-11-15', qty: '45 bottles', status: 'ACTIVE' },
    { name: 'Enrofloxacin 10%', batch: 'ENR-2026-01', expiry: '2026-10-05', qty: '12 bottles', status: 'EXPIRING_SOON' },
    { name: 'Sanitizer Spray', batch: 'SAN-2025-11', expiry: '2026-07-01', qty: '5 cans', status: 'EXPIRED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inventory & Stock Ledger</h2>
          <p className="text-xs text-slate-500 mt-1">Transaction-based inventory management for Feed and Medicine batches.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transfer Stock</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feed Inventory */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Feed Inventory Ledger</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Feed Type</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5 text-right">Bags</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {feedStock.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{row.type}</td>
                    <td className="p-2.5">{row.location}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">{row.bags}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Medicine Inventory */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Medicine Batches & Expiry Alerts</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Medicine</th>
                  <th className="p-2.5">Batch & Expiry</th>
                  <th className="p-2.5 text-right">Qty</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {medicineBatches.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{row.name}</td>
                    <td className="p-2.5">
                      <div className="font-mono text-xs">{row.batch}</div>
                      <div className="text-[10px] text-slate-500">Exp: {row.expiry}</div>
                    </td>
                    <td className="p-2.5 text-right font-bold">{row.qty}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                        row.status === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
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
