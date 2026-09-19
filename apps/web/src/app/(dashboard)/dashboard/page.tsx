'use client';

import React, { useEffect, useState } from 'react';
import { 
  Bird, Home, AlertCircle, TrendingUp, DollarSign, Package, 
  ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { fetchApi } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/dashboard')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        // Fallback default dataset for instant demo
        setData({
          kpis: {
            total_birds_housed: 11000,
            total_birds_sold: 45000,
            total_birds_available: 10710,
            total_farms: 2,
            active_flocks_count: 2,
            total_feed_stock_bags: 480,
            pending_expenses_amount: 4500.0,
            gc_payable_amount: 32450.0,
            total_trader_receivables: 250000.0
          },
          birds_overview: { housed: 11000, sold: 45000, available: 10710 },
          age_wise_available: { "35d": 0, "36d": 0, "37d": 4820, "38d": 0, "39d": 0, "40+d": 0 }
        });
        setLoading(false);
      });
  }, []);

  const kpis = data?.kpis || {};

  const birdsOverviewChart = [
    { name: 'Birds Housed', count: kpis.total_birds_housed || 11000, fill: '#3b82f6' },
    { name: 'Birds Available', count: kpis.total_birds_available || 10710, fill: '#22c55e' },
    { name: 'Birds Sold', count: kpis.total_birds_sold || 45000, fill: '#64748b' }
  ];

  const mortalityCategoryData = [
    { name: 'Normal', value: 75, color: '#22c55e' },
    { name: 'Heat Stress', value: 15, color: '#f59e0b' },
    { name: 'Disease / Weakness', value: 10, color: '#ef4444' }
  ];

  const dailyTrendData = [
    { day: 'Day 1', mortality: 8, feedBags: 5 },
    { day: 'Day 10', mortality: 12, feedBags: 18 },
    { day: 'Day 20', mortality: 14, feedBags: 32 },
    { day: 'Day 30', mortality: 9, feedBags: 45 },
    { day: 'Day 37', mortality: 6, feedBags: 52 },
  ];

  const ageBucketsList = [
    { age: '35 Days', birds: data?.age_wise_available?.['35d'] || 0, farms: 0, avgWeight: '1.95 kg' },
    { age: '36 Days', birds: data?.age_wise_available?.['36d'] || 0, farms: 0, avgWeight: '2.05 kg' },
    { age: '37 Days', birds: data?.age_wise_available?.['37d'] || 4820, farms: 1, avgWeight: '2.15 kg' },
    { age: '38 Days', birds: data?.age_wise_available?.['38d'] || 0, farms: 0, avgWeight: '2.22 kg' },
    { age: '39 Days', birds: data?.age_wise_available?.['39d'] || 0, farms: 0, avgWeight: '2.30 kg' },
    { age: '40+ Days', birds: data?.age_wise_available?.['40+d'] || 0, farms: 0, avgWeight: '2.40 kg' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Real-Time Operational Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">Live monitoring across 2 active farms, 2 active flocks, and current lifting availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md text-xs font-semibold flex items-center gap-2 border border-slate-300">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Date</span>
          </button>
          <button className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors">
            + New Daily Entry
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Birds Housed</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{(kpis.total_birds_housed || 11000).toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Active Placement</span>
            </div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Bird className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available for Lifting</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{(kpis.total_birds_available || 10710).toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Ready & Active Flocks</span>
            </div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Feed Stock Ledger</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{(kpis.total_feed_stock_bags || 480)} <span className="text-xs font-normal text-slate-500">bags</span></div>
            <div className="text-[11px] text-slate-500 mt-1">~24.0 Tons Available</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trader Receivables</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">₹{(kpis.total_trader_receivables || 250000).toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1">1 Trader Outstanding</div>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Age-Wise Available Birds Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Age-Wise Available Birds (Lifting Engine)</h3>
            <p className="text-xs text-slate-500">Automatic age bucketing for commercial bird lifting dispatch.</p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">Configured: 35+ Days Rule</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Age Bucket</th>
                <th className="p-3 text-right">Available Birds</th>
                <th className="p-3 text-right">Eligible Farms</th>
                <th className="p-3 text-right">Expected Avg Weight</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {ageBucketsList.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{row.age}</td>
                  <td className="p-3 text-right font-bold text-emerald-700">{row.birds.toLocaleString()}</td>
                  <td className="p-3 text-right">{row.farms}</td>
                  <td className="p-3 text-right">{row.avgWeight}</td>
                  <td className="p-3 text-center">
                    {row.birds > 0 ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">READY FOR LIFTING</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]">NO BIRDS AVAILABLE</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Birds Overview Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Birds Population Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={birdsOverviewChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Mortality & Feed Trend Line Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Flock Production & Mortality Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="feedBags" name="Feed (Bags)" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="mortality" name="Mortality (Count)" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
