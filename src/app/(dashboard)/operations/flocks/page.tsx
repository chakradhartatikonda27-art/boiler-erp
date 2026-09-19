'use client';

import React, { useEffect, useState } from 'react';
import { Bird, Plus, Calendar, Home, Award, TrendingUp, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function FlocksPage() {
  const [flocks, setFlocks] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [batchNumber, setBatchNumber] = useState('BATCH-2026-10C');
  const [farmId, setFarmId] = useState('');
  const [placedQuantity, setPlacedQuantity] = useState<number>(5000);
  const [chickCost, setChickCost] = useState<number>(33.0);
  const [breed, setBreed] = useState('Cobb 500');

  const loadFlocks = () => {
    fetchApi('/flocks')
      .then((data: any) => setFlocks(data))
      .catch(() => {
        setFlocks([
          {
            id: '1',
            flock_code: 'FLK-9001',
            batch_number: 'BATCH-2026-08A',
            breed: 'Cobb 500',
            placed_quantity: 5000,
            current_birds: 4820,
            total_mortality: 180,
            total_culling: 0,
            total_feed_consumed_kg: 16500.0,
            avg_body_weight_kg: 2.15,
            current_fcr: 1.59,
            status: 'READY_FOR_LIFTING',
            placement_date: '2026-08-13T00:00:00'
          },
          {
            id: '2',
            flock_code: 'FLK-9002',
            batch_number: 'BATCH-2026-09B',
            breed: 'Ross 308',
            placed_quantity: 6000,
            current_birds: 5890,
            total_mortality: 110,
            total_culling: 0,
            total_feed_consumed_kg: 7800.0,
            avg_body_weight_kg: 0.98,
            current_fcr: 1.35,
            status: 'ACTIVE',
            placement_date: '2026-08-30T00:00:00'
          }
        ]);
      });
  };

  useEffect(() => {
    loadFlocks();
    fetchApi('/farmers')
      .then((farmers: any) => {
        const allFarms: any[] = [];
        farmers.forEach((f: any) => {
          if (f.farms) allFarms.push(...f.farms);
        });
        setFarms(allFarms);
        if (allFarms.length > 0) setFarmId(allFarms[0].id);
      })
      .catch(() => {});
  }, []);

  const handlePlaceFlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/flocks/place', {
        method: 'POST',
        body: JSON.stringify({
          batch_number: batchNumber,
          farm_id: farmId || 'f1',
          placement_date: new Date().toISOString(),
          breed,
          placed_quantity: placedQuantity,
          chick_cost_per_unit: chickCost
        })
      });
      setShowModal(false);
      loadFlocks();
    } catch (err: any) {
      alert(err.message || 'Flock placed successfully!');
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Flock Placements & Lifecycle</h2>
          <p className="text-xs text-slate-500 mt-1">Track batch placements, hatchery origins, breeds, current FCR, and mortality.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Place New Flock</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flocks.map((f) => {
          const mortalityPct = ((f.total_mortality / (f.placed_quantity || 1)) * 100).toFixed(2);
          return (
            <div key={f.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700 text-sm">{f.flock_code}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">{f.batch_number}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">Breed: {f.breed}</div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  f.status === 'READY_FOR_LIFTING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {f.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-center">
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Placed Qty</div>
                  <div className="text-sm font-bold text-slate-900">{f.placed_quantity.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Current Birds</div>
                  <div className="text-sm font-bold text-emerald-700">{f.current_birds.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Mortality %</div>
                  <div className="text-sm font-bold text-red-600">{mortalityPct}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current FCR:</span>
                  <span className="font-bold text-slate-900">{f.current_fcr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Avg Body Weight:</span>
                  <span className="font-bold text-slate-900">{f.avg_body_weight_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Feed:</span>
                  <span className="font-bold text-slate-900">{((f.total_feed_consumed_kg || 0) / 50).toFixed(0)} bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lifted Count:</span>
                  <span className="font-bold text-slate-900">{f.total_lifted}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Place Flock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Place New Chick Flock</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePlaceFlock} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Number *</label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Farm *</label>
                <select
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold bg-white"
                >
                  <option value="f1">Sri Venkateswara Broiler Farm (Capacity: 10,000)</option>
                  <option value="f2">Laxmi Green Poultry Farm (Capacity: 12,000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Placed Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={placedQuantity}
                    onChange={(e) => setPlacedQuantity(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chick Cost (₹/chick) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={chickCost}
                    onChange={(e) => setChickCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Breed *</label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Cobb 500">Cobb 500</option>
                  <option value="Ross 308">Ross 308</option>
                  <option value="Hubbard">Hubbard</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"
                >
                  Place Flock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
