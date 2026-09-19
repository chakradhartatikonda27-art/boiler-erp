'use client';

import React, { useState } from 'react';
import { X, Truck, Scale, CheckCircle2, DollarSign, FileText } from 'lucide-react';

interface LiftingWeighbridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiftingWeighbridgeModal({ isOpen, onClose }: LiftingWeighbridgeModalProps) {
  const [vehicleNo, setVehicleNo] = useState('AP-31-TB-4829');
  const [traderName, setTraderName] = useState('Sri Ram Poultry Traders');
  const [grossWeightKg, setGrossWeightKg] = useState<number>(6850);
  const [tareWeightKg, setTareWeightKg] = useState<number>(2450);
  const [totalBirdsLifted, setTotalBirdsLifted] = useState<number>(2000);
  const [ratePerKg, setRatePerKg] = useState<number>(92.0);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const netWeightKg = Math.max(0, grossWeightKg - tareWeightKg);
  const avgBirdWeightKg = totalBirdsLifted > 0 ? netWeightKg / totalBirdsLifted : 0;
  const totalInvoiceAmount = netWeightKg * ratePerKg;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Weighbridge Bird Lifting Slip</h3>
              <p className="text-xs text-slate-400">Record vehicle gross/tare weights & generate trader invoice</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Weighbridge Slip & Invoice Saved!</h4>
            <p className="text-xs text-slate-500">Trader balance updated by ₹{totalInvoiceAmount.toLocaleString('en-IN')}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle No.</label>
                <input 
                  type="text" 
                  value={vehicleNo} 
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Trader</label>
                <input 
                  type="text" 
                  value={traderName} 
                  onChange={(e) => setTraderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Weighbridge Inputs */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Weighbridge Gross & Tare Weights</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gross Wt (kg)</label>
                  <input 
                    type="number" 
                    value={grossWeightKg} 
                    onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tare Wt (kg)</label>
                  <input 
                    type="number" 
                    value={tareWeightKg} 
                    onChange={(e) => setTareWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Net Bird Wt (kg)</label>
                  <div className="px-3 py-1.5 bg-emerald-100 rounded-lg text-xs font-bold text-emerald-900 border border-emerald-300">
                    {netWeightKg.toLocaleString()} kg
                  </div>
                </div>
              </div>
            </div>

            {/* Birds Count & Rate */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Birds Count</label>
                <input 
                  type="number" 
                  value={totalBirdsLifted} 
                  onChange={(e) => setTotalBirdsLifted(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Avg Wt / Bird</label>
                <div className="px-3 py-2 bg-blue-50 text-blue-900 rounded-lg text-xs font-bold border border-blue-200 mt-0.5">
                  {avgBirdWeightKg.toFixed(2)} kg
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rate / kg (₹)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={ratePerKg} 
                  onChange={(e) => setRatePerKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Invoice Total Banner */}
            <div className="p-4 bg-emerald-600 text-white rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <div className="text-xs text-emerald-100 uppercase font-semibold">Total Invoice Amount</div>
                <div className="text-2xl font-bold">₹{totalInvoiceAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-700/80">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Weighbridge Invoice</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
