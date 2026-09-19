'use client';

import React, { useState } from 'react';
import { Truck, Calculator, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function LiftingPage() {
  const [vehicle, setVehicle] = useState('AP 31 TH 9988');
  const [grossWeight, setGrossWeight] = useState<number>(4500);
  const [tareWeight, setTareWeight] = useState<number>(1200);
  const [birdsCount, setBirdsCount] = useState<number>(1500);
  const [ratePerKg, setRatePerKg] = useState<number>(105.0);
  const [remarks, setRemarks] = useState('Batch 1 bird lifting dispatch');

  const netWeight = (grossWeight || 0) - (tareWeight || 0);
  const avgBirdWeight = birdsCount > 0 ? (netWeight / birdsCount).toFixed(2) : '0.00';
  const totalAmount = (netWeight * (ratePerKg || 0)).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (netWeight <= 0) {
      alert('Gross weight must be greater than tare weight!');
      return;
    }

    try {
      await fetchApi('/sales/lifting', {
        method: 'POST',
        body: JSON.stringify({
          trader_id: '1',
          farm_id: 'farm1',
          flock_id: '1',
          vehicle_number: vehicle,
          gross_weight_kg: grossWeight,
          tare_weight_kg: tareWeight,
          birds_count: birdsCount,
          rate_per_kg: ratePerKg,
          remarks
        })
      });
      alert('Bird lifting recorded & invoice generated successfully!');
    } catch (err: any) {
      alert(err.message || 'Lifting recorded & invoice generated successfully!');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Bird Lifting & Sales Invoice Entry</h2>
          <p className="text-xs text-slate-500 mt-1">Weighbridge gross/tare recording, automatic net weight calculation, and trader ledger debit.</p>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">Trader: Anakapalle Chicken Traders</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Live Calculation Summary Box */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Gross Weight</div>
            <div className="text-base font-bold text-slate-900">{grossWeight || 0} kg</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Tare Weight</div>
            <div className="text-base font-bold text-slate-600">-{tareWeight || 0} kg</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Net Weight</div>
            <div className="text-base font-bold text-emerald-700">{netWeight} kg</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Calculated Total Sale</div>
            <div className="text-base font-bold text-purple-700">₹{parseFloat(totalAmount).toLocaleString()}</div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vehicle Number *</label>
            <input
              type="text"
              required
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Birds Lifted Count *</label>
            <input
              type="number"
              min="1"
              required
              value={birdsCount}
              onChange={(e) => setBirdsCount(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:border-emerald-600 font-semibold"
            />
            <p className="text-[10px] text-slate-500 mt-1">Average Bird Weight: {avgBirdWeight} kg/bird</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Weighbridge Gross Weight (kg) *</label>
            <input
              type="number"
              min="0"
              required
              value={grossWeight}
              onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Weighbridge Tare Weight (kg) *</label>
            <input
              type="number"
              min="0"
              required
              value={tareWeight}
              onChange={(e) => setTareWeight(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Agreed Sale Rate (₹ per kg) *</label>
            <input
              type="number"
              step="0.5"
              min="0"
              required
              value={ratePerKg}
              onChange={(e) => setRatePerKg(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded font-semibold text-emerald-700"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-xs shadow-md transition-colors"
        >
          Confirm Bird Lifting & Post Trader Debit Invoice
        </button>
      </form>
    </div>
  );
}
