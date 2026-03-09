import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, LayoutDashboard, Download } from 'lucide-react';

export default function Admin() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
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

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
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
          
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#4A2411]/5">
            <div className="p-2 bg-[#F59E0B]/10 rounded-xl text-[#F59E0B]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#4A2411]/50 uppercase tracking-wider">Total Vendors</p>
              <p className="text-2xl font-black">{registrations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#4A2411]/10 overflow-hidden">
          {loading ? (
             <div className="p-12 text-center text-[#4A2411]/50 flex justify-center items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#4A2411]/30 border-t-[#F59E0B] rounded-full animate-spin" />
                Loading records...
             </div>
          ) : registrations.length === 0 ? (
             <div className="p-12 text-center text-[#4A2411]/50">No vendors registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#4A2411]/10">
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-sm tracking-wider">ID</th>
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-sm tracking-wider">Name</th>
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-sm tracking-wider">Email</th>
                    <th className="p-5 font-bold text-[#4A2411]/60 uppercase text-sm tracking-wider">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4A2411]/5">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-[#FAFAFA]/50 transition-colors">
                      <td className="p-5 font-medium text-[#4A2411]/40">#{reg.id}</td>
                      <td className="p-5 font-bold">{reg.name}</td>
                      <td className="p-5 font-medium text-[#4A2411]/80">{reg.email}</td>
                      <td className="p-5 font-medium text-[#4A2411]/50">
                        {new Date(reg.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
