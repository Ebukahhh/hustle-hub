import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Users, LayoutDashboard, Store, Wallet, RefreshCw, Link2, CheckCircle2 } from 'lucide-react';

export default function Admin() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'registrations' | 'pairing'>('registrations');

  // Pairing state
  const [vendorA, setVendorA] = useState('');
  const [vendorB, setVendorB] = useState('');
  const [standNumber, setStandNumber] = useState('');
  const [pairing, setPairing] = useState(false);
  const [pairMessage, setPairMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchVendors();

      const channel = supabase
        .channel('vendors-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'vendors',
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setVendors(prev => [payload.new as any, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setVendors(prev => prev.map(v =>
              v.id === (payload.new as any).id ? payload.new as any : v
            ));
          } else if (payload.eventType === 'DELETE') {
            setVendors(prev => prev.filter(v => v.id !== (payload.old as any).id));
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'hustle2026') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const fetchVendors = useCallback(async () => {
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
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = () => { setRefreshing(true); fetchVendors(); };

  const handlePairVendors = async () => {
    if (!vendorA || !vendorB || !standNumber) {
      setPairMessage('Please select both vendors and enter a stand number.');
      return;
    }
    if (vendorA === vendorB) {
      setPairMessage('Please select two different vendors.');
      return;
    }
    setPairing(true);
    setPairMessage('');
    try {
      const { error: e1 } = await supabase.from('vendors').update({
        stand_partner_id: vendorB,
        stand_label: 'A',
        stand_number: standNumber,
      }).eq('id', vendorA);

      const { error: e2 } = await supabase.from('vendors').update({
        stand_partner_id: vendorA,
        stand_label: 'B',
        stand_number: standNumber,
      }).eq('id', vendorB);

      if (e1 || e2) throw new Error('Failed to update one or both vendors.');

      setPairMessage(`✅ Paired successfully! Stand ${standNumber}A & ${standNumber}B assigned.`);
      setVendorA('');
      setVendorB('');
      setStandNumber('');
      fetchVendors();
    } catch (err: any) {
      setPairMessage(`❌ Error: ${err.message}`);
    } finally {
      setPairing(false);
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

  const confirmedCount = vendors.filter(v => v.payment_status === 'confirmed').length;
  const pendingCount = vendors.filter(v => v.payment_status === 'pending').length;
  const shareStandVendors = vendors.filter(v => v.stand_type === 'Share a Stand' && v.payment_status === 'confirmed');
  const unpairedVendors = shareStandVendors.filter(v => !v.stand_partner_id);
  const pairedVendors = shareStandVendors.filter(v => v.stand_partner_id);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#4A2411] font-sans">
      <nav className="bg-white border-b border-[#4A2411]/10 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xs">HH</div>
          <span className="font-bold tracking-widest uppercase text-sm">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#4A2411]/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'registrations' ? 'bg-white shadow-sm text-[#4A2411]' : 'text-[#4A2411]/50 hover:text-[#4A2411]'}`}
            >
              Registrations
            </button>
            <button
              onClick={() => setActiveTab('pairing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pairing' ? 'bg-white shadow-sm text-[#4A2411]' : 'text-[#4A2411]/50 hover:text-[#4A2411]'}`}
            >
              <Link2 size={14} />
              Pair Vendors
              {unpairedVendors.length > 0 && (
                <span className="bg-[#F59E0B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unpairedVendors.length}</span>
              )}
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A2411]/5 hover:bg-[#F59E0B]/10 text-[#4A2411] font-bold text-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-bold font-display flex items-center gap-3">
            <LayoutDashboard className="text-[#F59E0B]" size={36} />
            {activeTab === 'registrations' ? 'Vendor Registrations' : 'Pair Vendors'}
          </h1>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Total Vendors', value: vendors.length, icon: <Users size={24} />, color: 'text-[#F59E0B] bg-[#F59E0B]/10' },
              { label: 'Confirmed', value: confirmedCount, icon: <Wallet size={24} />, color: 'text-green-600 bg-green-500/10' },
              { label: 'Pending', value: pendingCount, icon: <Wallet size={24} />, color: 'text-yellow-600 bg-yellow-500/10' },
              { label: 'Revenue', value: `GH₵ ${vendors.filter(v => v.payment_status === 'confirmed').reduce((s, v) => s + Number(v.amount_due), 0)}`, icon: <Wallet size={24} />, color: 'text-green-600 bg-green-500/10' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#4A2411]/5">
                <div className={`p-2 rounded-xl ${stat.color}`}>{stat.icon}</div>
                <div>
                  <p className="text-sm font-bold text-[#4A2411]/50 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.label === 'Confirmed' ? 'text-green-600' : stat.label === 'Pending' ? 'text-yellow-600' : ''}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
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
                      <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-xs tracking-wider">Stand</th>
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
                            <div className="text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 inline-block px-2 py-1 rounded mt-1">{vendor.student_id}</div>
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
                            <div className="text-[10px] uppercase font-bold text-[#F59E0B] mt-1 tracking-wider bg-[#F59E0B]/10 inline-block px-2 py-1 rounded">+ Electricity</div>
                          )}
                        </td>
                        <td className="p-5">
                          {vendor.stand_number ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-[#4A2411]">Stand {vendor.stand_number}{vendor.stand_label}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#4A2411]/40 italic">Not assigned</span>
                          )}
                          {vendor.stand_partner_id && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-bold">
                              <Link2 size={10} /> Paired
                            </div>
                          )}
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col gap-2 items-start">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${vendor.payment_status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : vendor.payment_status === 'failed'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                              {vendor.payment_status}
                            </div>
                            <div className="text-sm font-black">GH₵ {vendor.amount_due}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pairing Tab */}
        {activeTab === 'pairing' && (
          <div className="space-y-8">
            {/* Pair form */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#4A2411]/10 p-8">
              <h2 className="text-xl font-bold text-[#4A2411] mb-6 flex items-center gap-2"><Link2 size={20} className="text-[#F59E0B]" /> Pair Two Share-a-Stand Vendors</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A2411]/60 uppercase tracking-wider mb-2">Vendor A (gets label A)</label>
                  <select
                    value={vendorA}
                    onChange={e => setVendorA(e.target.value)}
                    className="w-full border border-[#4A2411]/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option value="">Select vendor...</option>
                    {unpairedVendors.filter(v => v.id !== vendorB).map(v => (
                      <option key={v.id} value={v.id}>{v.full_name} — {v.business_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A2411]/60 uppercase tracking-wider mb-2">Vendor B (gets label B)</label>
                  <select
                    value={vendorB}
                    onChange={e => setVendorB(e.target.value)}
                    className="w-full border border-[#4A2411]/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option value="">Select vendor...</option>
                    {unpairedVendors.filter(v => v.id !== vendorA).map(v => (
                      <option key={v.id} value={v.id}>{v.full_name} — {v.business_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A2411]/60 uppercase tracking-wider mb-2">Stand Number (e.g. 7)</label>
                  <input
                    type="text"
                    value={standNumber}
                    onChange={e => setStandNumber(e.target.value)}
                    placeholder="e.g. 7"
                    className="w-full border border-[#4A2411]/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>
              {pairMessage && (
                <p className={`text-sm font-bold mb-4 ${pairMessage.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{pairMessage}</p>
              )}
              <button
                onClick={handlePairVendors}
                disabled={pairing || !vendorA || !vendorB || !standNumber}
                className="bg-[#4A2411] text-white rounded-full px-8 py-3 font-bold hover:bg-[#F59E0B] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Link2 size={16} /> {pairing ? 'Pairing...' : 'Confirm Pairing'}
              </button>
            </div>

            {/* Unpaired vendors */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#4A2411]/10 p-8">
              <h2 className="text-xl font-bold text-[#4A2411] mb-4">Unpaired Share-a-Stand Vendors ({unpairedVendors.length})</h2>
              {unpairedVendors.length === 0 ? (
                <p className="text-[#4A2411]/40 text-sm">All share-a-stand vendors are paired.</p>
              ) : (
                <div className="space-y-3">
                  {unpairedVendors.map(v => (
                    <div key={v.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                      <div>
                        <p className="font-bold text-[#4A2411]">{v.full_name}</p>
                        <p className="text-sm text-[#4A2411]/60">{v.business_name} · {v.email}</p>
                      </div>
                      <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Awaiting pair</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paired vendors */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#4A2411]/10 p-8">
              <h2 className="text-xl font-bold text-[#4A2411] mb-4">Paired Vendors ({pairedVendors.length})</h2>
              {pairedVendors.length === 0 ? (
                <p className="text-[#4A2411]/40 text-sm">No vendors paired yet.</p>
              ) : (
                <div className="space-y-3">
                  {pairedVendors.map(v => (
                    <div key={v.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <div>
                        <p className="font-bold text-[#4A2411]">{v.full_name} <span className="text-[#F59E0B]">— Stand {v.stand_number}{v.stand_label}</span></p>
                        <p className="text-sm text-[#4A2411]/60">{v.business_name} · {v.email}</p>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                        <CheckCircle2 size={16} /> Paired
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

