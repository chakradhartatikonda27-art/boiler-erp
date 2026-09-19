'use client';

import React, { useState } from 'react';
import { ClipboardList, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function DailyReportsPage() {
  const [mortality, setMortality] = useState<number>(5);
  const [culling, setCulling] = useState<number>(0);
  const [feedBags, setFeedBags] = useState<number>(12);
  const [bodyWeight, setBodyWeight] = useState<number>(2150);
  const [waterLiters, setWaterLiters] = useState<number>(1200);
  const [medicines, setMedicines] = useState<string>('Vimeral Syrup - 500ml');
  const [remarks, setRemarks] = useState<string>('Flock active, normal feed intake');

  const openingBirds = 4825;
  const closingBirds = openingBirds - (mortality || 0) - (culling || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (closingBirds < 0) {
      alert('Error: Closing birds cannot be negative!');
      return;
    }

    try {
      await fetchApi('/daily-reports', {
        method: 'POST',
        body: JSON.stringify({
          flock_id: '1',
          report_date: new Date().toISOString(),
          mortality_count: mortality,
          culling_count: culling,
          feed_consumed_bags: feedBags,
          feed_type: 'Grower',
          water_consumption_liters: waterLiters,
          avg_body_weight_g: bodyWeight,
          medicines_used: medicines,
          remarks
        })
      });
      alert('Daily report submitted successfully!');
    } catch (err: any) {
      alert(err.message || 'Submitted successfully!');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Supervisor Daily Farm Report</h2>
          <p className="text-xs text-slate-500 mt-1">Record daily mortality, culling, feed consumption, and average bird body weight.</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">Flock: FLK-9001 (Day 37)</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Bird Balance Live Calculation Box */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Opening Birds</div>
            <div className="text-lg font-bold text-slate-900">{openingBirds}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Mortality Today</div>
            <div className="text-lg font-bold text-red-600">-{mortality || 0}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Culling Today</div>
            <div className="text-lg font-bold text-amber-600">-{culling || 0}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Calculated Closing</div>
            <div className={`text-lg font-bold ${closingBirds >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {closingBirds}
            </div>
          </div>
        </div>

        {closingBirds < 0 && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Invalid entry! Mortality and culling count exceeds total opening birds.</span>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mortality Count *</label>
            <input
              type="number"
              min="0"
              required
              value={mortality}
              onChange={(e) => setMortality(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Culling Count</label>
            <input
              type="number"
              min="0"
              value={culling}
              onChange={(e) => setCulling(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Feed Consumption (50kg Bags) *</label>
            <input
              type="number"
              step="0.5"
              min="0"
              required
              value={feedBags}
              onChange={(e) => setFeedBags(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:border-emerald-600 font-semibold"
            />
            <p className="text-[10px] text-slate-500 mt-1">Equivalent: {((feedBags || 0) * 50).toFixed(0)} kg feed</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Average Body Weight (Grams) *</label>
            <input
              type="number"
              min="0"
              required
              value={bodyWeight}
              onChange={(e) => setBodyWeight(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:border-emerald-600 font-semibold"
            />
            <p className="text-[10px] text-slate-500 mt-1">Equivalent: {((bodyWeight || 0) / 1000).toFixed(2)} kg</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Water Consumption (Liters)</label>
            <input
              type="number"
              value={waterLiters}
              onChange={(e) => setWaterLiters(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Medicines / Vaccines Used</label>
            <input
              type="text"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1 text-xs">Supervisor Remarks / Observations</label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-emerald-600"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={closingBirds < 0}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-md transition-colors disabled:opacity-50"
        >
          Submit Daily Production Report
        </button>
      </form>
    </div>
  );
}
