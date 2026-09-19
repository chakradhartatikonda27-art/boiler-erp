'use client';

import React, { useEffect, useState } from 'react';
import { Bird, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function AvailabilityPage() {
  const [availableFlocks, setAvailableFlocks] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/sales/birds/available')
      .then((data: any) => setAvailableFlocks(data))
      .catch(() => {
        setAvailableFlocks([
          {
            flock_id: '1',
            flock_code: 'FLK-9001',
            batch_number: 'BATCH-2026-08A',
            farm_name: 'Sri Venkateswara Broiler Farm',
            age_days: 37,
            available_birds: 4820,
            avg_body_weight_kg: 2.15,
            status: 'READY_FOR_LIFTING'
          }
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Bird Availability Engine</h2>
          <p className="text-xs text-slate-500 mt-1">Flocks eligible for commercial bird lifting (Age threshold: 35+ days).</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
          Total Eligible Birds: {availableFlocks.reduce((acc, f) => acc + f.available_birds, 0).toLocaleString()}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Flock Code</th>
                <th className="p-3">Farm Name</th>
                <th className="p-3 text-center">Age (Days)</th>
                <th className="p-3 text-right">Available Birds</th>
                <th className="p-3 text-right">Avg Body Weight</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {availableFlocks.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-emerald-700">{f.flock_code}</td>
                  <td className="p-3 font-bold text-slate-900">{f.farm_name}</td>
                  <td className="p-3 text-center font-bold text-amber-600">{f.age_days}d</td>
                  <td className="p-3 text-right font-bold text-emerald-700">{f.available_birds.toLocaleString()}</td>
                  <td className="p-3 text-right">{f.avg_body_weight_kg} kg</td>
                  <td className="p-3 text-center">
                    <a
                      href="/sales/lifting"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <span>Lift Birds</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
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
