"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, LogOut, User, Loader2, Shield, X, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  full_name: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
}

interface UserRegistration {
  id: string;
  category: string;
  status: string;
  partner_name: string | null;
  created_at: string;
  tournaments: {
    name: string;
    start_date: string;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ id?: string, email?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentRegId, setPaymentRegId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }

        // Fetch Registrations
        const { data: regData } = await supabase
          .from('registrations')
          .select(`
            id, 
            category, 
            status, 
            partner_name, 
            created_at,
            tournaments ( name, start_date )
          `)
          .eq('player_id', user.id)
          .order('created_at', { ascending: false });

        if (regData) {
          // Type assertion since Supabase returns tournaments as an array or object depending on relation
          setRegistrations(regData as unknown as UserRegistration[]);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1128] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1128] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        {/* Top Bar inside the box */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button onClick={handleSignOut} className="text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4 overflow-hidden border-2 border-white/10">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">
            {profile?.full_name || user?.email?.split('@')[0] || 'Player'}
          </h1>
          <p className="text-sm text-slate-400 mb-3">{user?.email}</p>
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
              {profile?.role || 'Player'}
            </span>
          </div>
        </div>

        {/* My Tournaments Section */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">My Tournaments</h2>
          </div>

          {registrations.length === 0 ? (
            <div className="bg-black/20 rounded-2xl p-6 text-center border border-white/5">
              <p className="text-sm text-slate-400 mb-3">You aren't registered for any tournaments.</p>
              <Link href="/" className="inline-block bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors border border-white/10">
                Find Tournaments
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map(reg => (
                <div key={reg.id} className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-0.5">{reg.tournaments?.name || 'Tournament'}</h3>
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">ID: {reg.id.split('-')[0]}</p>
                      <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {reg.category}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                        reg.status === 'registered' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        reg.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {reg.status}
                      </span>
                      {reg.status === 'registered' && (
                        <button 
                          onClick={() => setPaymentRegId(reg.id.split('-')[0].toUpperCase())}
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <CreditCard className="w-3 h-3" />
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Payment Modal */}
        {paymentRegId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setPaymentRegId(null)}>
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setPaymentRegId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="text-center">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">Complete Payment</h3>
                <p className="text-xs text-gray-500 mb-4">(ignore if done)</p>
                
                <div className="bg-blue-50 rounded-xl p-3 mb-5 border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Your Registration ID</p>
                  <p className="text-2xl font-black text-blue-700 tracking-widest">{paymentRegId}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <img src="/payment scanner.jpg" alt="Payment QR Code" className="w-48 h-48 mx-auto rounded-lg shadow-sm border border-gray-200 object-contain mb-3" />
                  <p className="text-xs text-gray-500 font-semibold mb-1">Scan to pay or use UPI ID:</p>
                  <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 inline-block">
                    <p className="text-sm font-mono font-bold text-gray-800">notesforall25-1@okhdfcbank</p>
                  </div>
                  <p className="text-[10px] text-red-500 font-bold mt-3 uppercase">⚠️ Please include your Registration ID ({paymentRegId}) in the payment notes!</p>
                </div>

                <button 
                  onClick={() => setPaymentRegId(null)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
