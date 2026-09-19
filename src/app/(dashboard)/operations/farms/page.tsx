'use client';

import React, { useState } from 'react';
import { Home, Plus, Search, MapPin, CheckCircle, AlertTriangle, ShieldCheck, Activity, ChevronRight, Layers } from 'lucide-react';

interface Shed {
  id: string;
  code: string;
  capacity: number;
  type: 'Environmentally Controlled' | 'Open Side';
  activeFlock?: string;
  status: 'Occupied' | 'Vacant' | 'Sanitizing';
}

interface Farm {
  id: string;
  name: string;
  code: string;
  farmerName: string;
  location: string;
  totalCapacity: number;
  sheds: Shed[];
  status: 'Active' | 'Under Maintenance';
  biosecurityScore: number;
}

export default function FarmsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const farmsData: Farm[] = [
    {
      id: 'FARM-001',
      name: 'Sri Venkateswara Poultry Farm',
      code: 'SV-FARM-01',
      farmerName: 'Ramesh Reddy',
      location: 'Anakapalle, Visakhapatnam Dist.',
      totalCapacity: 12000,
      biosecurityScore: 98,
      status: 'Active',
      sheds: [
        { id: 'SHED-01', code: 'Shed 1 (EC)', capacity: 6000, type: 'Environmentally Controlled', activeFlock: 'FLOCK-2026-089', status: 'Occupied' },
        { id: 'SHED-02', code: 'Shed 2 (Open)', capacity: 6000, type: 'Open Side', activeFlock: undefined, status: 'Sanitizing' }
      ]
    },
    {
      id: 'FARM-002',
      name: 'Gayatri Broiler Farm',
      code: 'GB-FARM-02',
      farmerName: 'K. Srinivasa Rao',
      location: 'Srikakulam Rural',
      totalCapacity: 10000,
      biosecurityScore: 92,
      status: 'Active',
      sheds: [
        { id: 'SHED-03', code: 'Shed A (EC)', capacity: 5000, type: 'Environmentally Controlled', activeFlock: 'FLOCK-2026-092', status: 'Occupied' },
        { id: 'SHED-04', code: 'Shed B (EC)', capacity: 5000, type: 'Environmentally Controlled', activeFlock: undefined, status: 'Vacant' }
      ]
    },
    {
      id: 'FARM-003',
      name: 'Lakshmi Narayana Broilers',
      code: 'LN-FARM-03',
      farmerName: 'M. Krishna Murthy',
      location: 'Vizianagaram East',
      totalCapacity: 15000,
      biosecurityScore: 95,
      status: 'Active',
      sheds: [
        { id: 'SHED-05', code: 'Main EC Shed', capacity: 10000, type: 'Environmentally Controlled', activeFlock: undefined, status: 'Vacant' },
        { id: 'SHED-06', code: 'Shed 2 (Open)', capacity: 5000, type: 'Open Side', activeFlock: undefined, status: 'Vacant' }
      ]
    }
  ];

  const filteredFarms = farmsData.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          farm.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          farm.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || farm.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            Farms & Sheds Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Register and monitor farm infrastructure, shed capacities, biosecurity status, and flock occupancy.
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>+ Register New Farm</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered Farms</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">3 Farms</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">100% Operational Compliance</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Sheds</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">6 Sheds</div>
          <div className="text-[11px] text-slate-500 mt-1">2 Occupied · 3 Vacant · 1 Sanitizing</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Housing Capacity</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">37,000 Birds</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">11,000 Currently Placed</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Biosecurity Rating</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">95.0%</div>
          <div className="text-[11px] text-slate-500 mt-1">High Audit Grade</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search farm name, code, farmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* Farms List */}
      <div className="space-y-4">
        {filteredFarms.map((farm) => (
          <div key={farm.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900">{farm.name}</h3>
                  <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-mono font-bold rounded">
                    {farm.code}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    {farm.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {farm.location}
                  </span>
                  <span>•</span>
                  <span>Farmer: <strong className="text-slate-700">{farm.farmerName}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Total Capacity</div>
                  <div className="text-sm font-bold text-slate-900">{farm.totalCapacity.toLocaleString()} Birds</div>
                </div>
                <div className="text-right pl-4 border-l border-slate-200">
                  <div className="text-xs text-slate-500">Biosecurity Score</div>
                  <div className="text-sm font-bold text-emerald-600">{farm.biosecurityScore}% Grade A</div>
                </div>
              </div>
            </div>

            {/* Sheds Table */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-400" />
                  Sheds Configuration ({farm.sheds.length} Sheds)
                </h4>
                <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  + Add Shed
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Shed Code / Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Capacity</th>
                      <th className="p-3">Active Placement</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {farm.sheds.map((shed) => (
                      <tr key={shed.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{shed.code}</td>
                        <td className="p-3 text-slate-600">{shed.type}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{shed.capacity.toLocaleString()} Birds</td>
                        <td className="p-3">
                          {shed.activeFlock ? (
                            <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {shed.activeFlock}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No Active Flock</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            shed.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                            shed.status === 'Sanitizing' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {shed.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
