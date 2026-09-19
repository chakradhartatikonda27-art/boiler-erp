'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Home, Phone, MapPin, Building, ShieldAlert, Check } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('Visakhapatnam');
  const [bankName, setBankName] = useState('State Bank of India');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const loadFarmers = () => {
    fetchApi('/farmers')
      .then((data: any) => setFarmers(data))
      .catch(() => {
        // Default seed demo fallback
        setFarmers([
          {
            id: '1',
            farmer_code: 'AP-VSP-00001',
            full_name: 'Rambabu Naidu',
            mobile: '+91-9988776655',
            address: 'Plot 14, Main Road, Kasimkota',
            state: 'Andhra Pradesh',
            district: 'Visakhapatnam',
            bank_name: 'State Bank of India',
            bank_account_no: '30918239102',
            ifsc_code: 'SBIN0001234',
            status: 'ACTIVE',
            farms: [{ id: 'f1', farm_name: 'Sri Venkateswara Broiler Farm', total_capacity: 10000 }]
          },
          {
            id: '2',
            farmer_code: 'AP-VSP-00002',
            full_name: 'Koteswara Rao',
            mobile: '+91-9988776644',
            address: 'Shed Road, Munagapaka',
            state: 'Andhra Pradesh',
            district: 'Visakhapatnam',
            bank_name: 'HDFC Bank',
            bank_account_no: '50100293810',
            ifsc_code: 'HDFC0000567',
            status: 'ACTIVE',
            farms: [{ id: 'f2', farm_name: 'Laxmi Green Poultry Farm', total_capacity: 12000 }]
          }
        ]);
      });
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const handleCreateFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/farmers', {
        method: 'POST',
        body: JSON.stringify({
          full_name: fullName,
          mobile,
          address,
          state,
          district,
          bank_name: bankName,
          bank_account_no: bankAccountNo,
          ifsc_code: ifscCode
        })
      });
      setShowModal(false);
      loadFarmers();
    } catch (err: any) {
      alert(err.message || 'Error creating farmer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Farmer Management</h2>
          <p className="text-xs text-slate-500 mt-1">Register, edit, and inspect contracted poultry farmers and bank details.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Farmer</span>
        </button>
      </div>

      {/* Farmers Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registered Farmers ({farmers.length})</span>
          <input
            type="text"
            placeholder="Filter by name or farmer code..."
            className="px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs w-64 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase">
              <tr>
                <th className="p-3">Farmer Code</th>
                <th className="p-3">Farmer Name</th>
                <th className="p-3">Mobile & Address</th>
                <th className="p-3">Farms & Capacity</th>
                <th className="p-3">Bank Details</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {farmers.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-emerald-700">{f.farmer_code}</td>
                  <td className="p-3 font-bold text-slate-900">{f.full_name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{f.mobile}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{f.address}, {f.district}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {f.farms && f.farms.length > 0 ? (
                      f.farms.map((farm: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          <span className="font-semibold text-slate-900">{farm.farm_name}</span>
                          <span className="text-[10px] text-slate-500 ml-1">({farm.total_capacity} capacity)</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No farm registered</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="text-xs font-semibold">{f.bank_name || 'N/A'}</div>
                    <div className="text-[10px] text-slate-500 font-mono">A/C: {f.bank_account_no || 'N/A'}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Farmer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Register New Farmer</h3>
            <form onSubmit={handleCreateFarmer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Satyanarayana Raju"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Village / Mandal / Street"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account No</label>
                  <input
                    type="text"
                    value={bankAccountNo}
                    onChange={(e) => setBankAccountNo(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
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
                  Save Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
