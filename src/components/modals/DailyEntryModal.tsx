'use client';

import React, { useState } from 'react';
import { X, ClipboardList, CheckCircle, AlertCircle, Bird, Package, Weight } from 'lucide-react';

interface DailyEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DailyEntryModal({ isOpen, onClose, onSuccess }: DailyEntryModalProps) {
  const [flockId, setFlockId] = useState('FLOCK-2026-089');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [mortality, setMortality] = useState<number>(4);
  const [culling, setCulling] = useState<number>(1);
  const [feedBags, setFeedBags] = useState<number>(12);
  const [feedType, setFeedType] = useState('Starter Feed (B2)');
  const [avgWeightGrams, setAvgWeightGrams] = useState<number>(1850);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">New Daily Production Log</h3>
              <p className="text-xs text-slate-400">Record daily flock mortality, feed intake & average weight</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Daily Entry Logged Successfully!</h4>
            <p className="text-xs text-slate-500">Live flock metrics and feed ledger updated automatically.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Active Flock</label>
                <select 
                  value={flockId} 
                  onChange={(e) => setFlockId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                >
                  <option value="FLOCK-2026-089">FLOCK-2026-089 (Anakapalle Shed 1)</option>
                  <option value="FLOCK-2026-092">FLOCK-2026-092 (Srikakulam Shed A)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Entry Date</label>
                <input 
                  type="date" 
                  value={entryDate} 
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Mortality & Culling */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Bird className="w-4 h-4 text-amber-600" />
                <span>Bird Mortality & Culling</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mortality Birds</label>
                  <input 
                    type="number"
                    min="0"
                    value={mortality}
                    onChange={(e) => setMortality(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Weak / Culling Birds</label>
                  <input 
                    type="number"
                    min="0"
                    value={culling}
                    onChange={(e) => setCulling(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Feed Consumption */}
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Package className="w-4 h-4 text-blue-600" />
                <span>Feed Consumption Ledger</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Feed Type</label>
                  <select 
                    value={feedType}
                    onChange={(e) => setFeedType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="Pre-Starter (B1)">Pre-Starter Feed (B1)</option>
                    <option value="Starter Feed (B2)">Starter Feed (B2)</option>
                    <option value="Finisher Feed (B3)">Finisher Feed (B3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bags Consumed (50kg)</label>
                  <input 
                    type="number"
                    min="0"
                    value={feedBags}
                    onChange={(e) => setFeedBags(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
              <p className="text-[11px] text-blue-700 font-medium">
                Calculated Weight: {(feedBags * 50).toLocaleString()} kg ({((feedBags * 50) / 1000).toFixed(2)} Tons)
              </p>
            </div>

            {/* Weight Sampling */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sample Avg Weight (Grams)</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={avgWeightGrams}
                    onChange={(e) => setAvgWeightGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">g</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Equiv Body Weight</label>
                <div className="px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-emerald-700 border border-slate-200 mt-0.5">
                  {(avgWeightGrams / 1000).toFixed(3)} kg / bird
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Supervisor Field Notes (Optional)</label>
              <input 
                type="text"
                placeholder="e.g., Vaccination administered, water intake normal"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Saving Log...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Production Log</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
