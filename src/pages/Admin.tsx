import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, LayoutDashboard, Store, Wallet } from 'lucide-react';

export default function Admin() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchVendors();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Very basic frontend protection for demo purposes
    if (password === 'hustle2026') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center border border-[#4A2411]/10">
          <div className="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-6">HH</div>
          <h2 className="text-2xl font-bold font-display text-[#4A2411] mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="px-6 py-4 rounded-xl border border-[#4A2411]/20 focus:outline-none focus:border-[#F59E0B] w-full"
            />
            <button type="submit" className="bg-[#4A2411] text-white py-4 rounded-xl font-bold hover:bg-[#F59E0B] transition-colors shadow-lg">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#4A2411] font-sans">
      <nav className="bg-white border-b border-[#4A2411]/10 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xs">HH</div>
          <span className="font-bold tracking-widest uppercase text-sm">Dashboard</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold font-display flex items-center gap-3">
            <LayoutDashboard className="text-[#F59E0B]" size={36} />
            Vendor Registrations
          </h1>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#4A2411]/5">
              <div className="p-2 bg-[#F59E0B]/10 rounded-xl text-[#F59E0B]">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#4A2411]/50 uppercase tracking-wider">Total Vendors</p>
                <p className="text-2xl font-black">{vendors.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#4A2411]/5">
              <div className="p-2 bg-green-500/10 rounded-xl text-green-600">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#4A2411]/50 uppercase tracking-wider">Confirmed Revenue</p>
                <p className="text-2xl font-black">
                  GH₵ {vendors.filter(v => v.payment_status === 'confirmed').reduce((sum, v) => sum + Number(v.amount_due), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#4A2411]/10 overflow-hidden">
          {loading ? (
             <div className="p-12 text-center text-[#4A2411]/50 flex justify-center items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#4A2411]/30 border-t-[#F59E0B] rounded-full animate-spin" />
                Loading records...
             </div>
          ) : vendors.length === 0 ? (
             <div className="p-12 text-center text-[#4A2411]/50">No vendors registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                   <tr className="bg-[#FAFAFA] border-b border-[#4A2411]/10">
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-xs tracking-wider">Vendor</th>
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-xs tracking-wider">Contact</th>
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-xs tracking-wider">Business Info</th>
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-xs tracking-wider">Category & Package</th>
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-xs tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4A2411]/5">
                  {vendors.map(vendor => (
                    <tr key={vendor.id} className="hover:bg-[#FAFAFA]/50 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-[#4A2411]">{vendor.full_name}</div>
                        <div className="text-xs text-[#4A2411]/50 mt-1">ID: {vendor.id.split('-')[0]}</div>
                        {vendor.student_id && (
                          <div className="text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 inline-block px-2 py-1 rounded mt-1">
                            {vendor.student_id}
                          </div>
                        )}
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-medium">{vendor.email}</div>
                        <div className="text-sm font-bold mt-1 text-[#4A2411]/70">{vendor.phone}</div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold flex items-center gap-2">
                           <Store size={14} className="text-[#F59E0B]" />
                           {vendor.business_name}
                        </div>
                        <div className="text-xs text-[#4A2411]/60 mt-1">{vendor.industry}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-medium">{vendor.vendor_type}</div>
                        <div className="text-xs text-[#4A2411]/60 mt-1">{vendor.stand_type}</div>
                        {vendor.electricity_needed && (
                           <div className="text-[10px] uppercase font-bold text-[#F59E0B] mt-1 tracking-wider bg-[#F59E0B]/10 inline-block px-2 py-1 rounded">
                             + Electricity
                           </div>
                        )}
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-2 items-start">
                           <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                             vendor.payment_status === 'confirmed' 
                               ? 'bg-green-100 text-green-700' 
                               : vendor.payment_status === 'failed'
                               ? 'bg-red-100 text-red-700'
                               : 'bg-yellow-100 text-yellow-700'
                           }`}>
                             {vendor.payment_status}
                           </div>
                           <div className="text-sm font-black">
                             GH₵ {vendor.amount_due}
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
