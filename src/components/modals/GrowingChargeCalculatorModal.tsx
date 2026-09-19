'use client';

import React, { useState } from 'react';
import { X, Calculator, DollarSign, Award, AlertTriangle, TrendingUp } from 'lucide-react';

interface GrowingChargeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GrowingChargeCalculatorModal({ isOpen, onClose }: GrowingChargeCalculatorModalProps) {
  const [birdsPlaced, setBirdsPlaced] = useState<number>(6000);
  const [birdsHarvested, setBirdsHarvested] = useState<number>(5760);
  const [totalLiveWeightKg, setTotalLiveWeightKg] = useState<number>(12672);
  const [totalFeedConsumedKg, setTotalFeedConsumedKg] = useState<number>(19008);
  const [baseRatePerKg, setBaseRatePerKg] = useState<number>(6.5);

  if (!isOpen) return null;

  // Calculations
  const mortalityCount = birdsPlaced - birdsHarvested;
  const mortalityPercentage = (mortalityCount / birdsPlaced) * 100;
  const avgBodyWeight = totalLiveWeightKg / birdsHarvested;
  const actualFcr = totalFeedConsumedKg / totalLiveWeightKg;
  const standardFcr = 1.55;
  const fcrDiff = standardFcr - actualFcr;

  // Feed bonus / penalty: ₹0.10 per 0.01 FCR difference
  const fcrIncentivePerKg = fcrDiff > 0 ? (fcrDiff / 0.01) * 0.10 : (fcrDiff / 0.01) * 0.10;
  
  // Mortality incentive: standard 3%, ₹0.05 per 1% lower
  const mortalityIncentivePerKg = mortalityPercentage < 3.0 ? (3.0 - mortalityPercentage) * 0.05 : 0;

  const netRatePerKg = Math.max(0, baseRatePerKg + fcrIncentivePerKg + mortalityIncentivePerKg);
  const totalBasePayout = totalLiveWeightKg * baseRatePerKg;
  const totalFcrBonus = totalLiveWeightKg * fcrIncentivePerKg;
  const totalMortalityBonus = totalLiveWeightKg * mortalityIncentivePerKg;
  const netTotalFarmerPayout = totalLiveWeightKg * netRatePerKg;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Growing Charges (GC) Rule Engine Simulator</h3>
              <p className="text-xs text-slate-400">Live line-item breakdown of farmer payout based on FCR & mortality performance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Birds Placed</label>
              <input 
                type="number" 
                value={birdsPlaced} 
                onChange={(e) => setBirdsPlaced(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Birds Harvested (Lifting)</label>
              <input 
                type="number" 
                value={birdsHarvested} 
                onChange={(e) => setBirdsHarvested(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Base Rate / kg (₹)</label>
              <input 
                type="number" 
                step="0.10"
                value={baseRatePerKg} 
                onChange={(e) => setBaseRatePerKg(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Total Live Weight (kg)</label>
              <input 
                type="number" 
                value={totalLiveWeightKg} 
                onChange={(e) => setTotalLiveWeightKg(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Total Feed Consumed (kg)</label>
              <input 
                type="number" 
                value={totalFeedConsumedKg} 
                onChange={(e) => setTotalFeedConsumedKg(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Standard Target FCR</label>
              <input 
                type="number" 
                disabled 
                value={standardFcr} 
                className="w-full px-3 py-1.5 bg-slate-200 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Performance KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <div className="text-[11px] font-semibold text-emerald-800 uppercase">Actual FCR</div>
              <div className="text-xl font-bold text-emerald-900 mt-0.5">{actualFcr.toFixed(3)}</div>
              <div className="text-[10px] text-emerald-700 font-medium">
                {fcrDiff >= 0 ? `Bonus +${fcrDiff.toFixed(3)} below target` : `Penalty ${fcrDiff.toFixed(3)} above target`}
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
              <div className="text-[11px] font-semibold text-blue-800 uppercase">Avg Body Weight</div>
              <div className="text-xl font-bold text-blue-900 mt-0.5">{avgBodyWeight.toFixed(2)} kg</div>
              <div className="text-[10px] text-blue-700 font-medium">Market Grade A</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
              <div className="text-[11px] font-semibold text-purple-800 uppercase">Mortality %</div>
              <div className="text-xl font-bold text-purple-900 mt-0.5">{mortalityPercentage.toFixed(2)}%</div>
              <div className="text-[10px] text-purple-700 font-medium">{mortalityCount} Birds Lost</div>
            </div>
          </div>

          {/* Line-Item Calculation Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase font-semibold">
                <tr>
                  <th className="p-3">Calculation Line Item</th>
                  <th className="p-3 text-right">Rate / kg</th>
                  <th className="p-3 text-right">Total Payout (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                <tr>
                  <td className="p-3">Base Growing Charge Rate</td>
                  <td className="p-3 text-right font-semibold">₹{baseRatePerKg.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold">₹{totalBasePayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr>
                  <td className="p-3 flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    FCR Incentive / Penalty Adjustment
                  </td>
                  <td className={`p-3 text-right font-bold ${totalFcrBonus >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {totalFcrBonus >= 0 ? '+' : ''}₹{fcrIncentivePerKg.toFixed(2)}
                  </td>
                  <td className={`p-3 text-right font-bold ${totalFcrBonus >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {totalFcrBonus >= 0 ? '+' : ''}₹{totalFcrBonus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 flex items-center gap-1.5 text-purple-700 font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    Mortality Incentive Bonus (&lt;3.0%)
                  </td>
                  <td className="p-3 text-right font-bold text-purple-600">+₹{mortalityIncentivePerKg.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-purple-600">+₹{totalMortalityBonus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr className="bg-emerald-50 text-slate-900 font-bold border-t-2 border-emerald-500">
                  <td className="p-3.5 text-sm text-emerald-900">NET FARMER GROWING CHARGE PAYOUT</td>
                  <td className="p-3.5 text-right text-sm text-emerald-900">₹{netRatePerKg.toFixed(2)} / kg</td>
                  <td className="p-3.5 text-right text-base text-emerald-700">₹{netTotalFarmerPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-medium">Rule Engine ID: GC-POLICY-2026-V2</p>
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
