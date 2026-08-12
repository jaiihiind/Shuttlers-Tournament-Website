"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Users, Search, Mail, Phone, Calendar, Loader2, Trash2, Download, Upload, MessageCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface RegistrationData {
  id: string;
  category: string;
  status: string;
  player_name: string | null;
  partner_name: string | null;
  whatsapp_no: string | null;
  dob: string | null;
  gender: string | null;
  event_type: string | null;
  location: string | null;
  created_at: string;
  profiles: { full_name: string | null; phone: string | null } | null;
  tournaments: { name: string } | null;
}

interface TournamentData {
  id: string;
  name: string;
  draws_url: string | null;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadingDraw, setUploadingDraw] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Check if user is the specified admin
      if (!user || user.email !== 'rishavray05@gmail.com') {
        router.push('/');
        return;
      }

      setIsAuthorized(true);

      // Fetch all registrations (requires RLS policy for admin)
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          category,
          status,
          player_name,
          partner_name,
          whatsapp_no,
          dob,
          gender,
          event_type,
          location,
          created_at,
          profiles ( full_name, phone ),
          tournaments ( name )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching registrations details:", error.message, error.details, error.hint, error.code);
        setRegistrations([]);
      } else if (data) {
        // @ts-ignore - Supabase types for joined tables can be tricky
        setRegistrations(data);
      }
      
      // Fetch tournaments
      const { data: tourneyData } = await supabase.from('tournaments').select('id, name, draws_url');
      if (tourneyData) setTournaments(tourneyData);

      setLoading(false);
    };

    fetchAdminData();
  }, [router]);

  const handleDeleteRegistration = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this registration? This action cannot be undone.")) return;
    
    const supabase = createClient();
    const { error } = await supabase.from('registrations').delete().eq('id', id);
    
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      // Remove from state
      setRegistrations(prev => prev.filter(reg => reg.id !== id));
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'registered' ? 'confirmed' : 'registered';
    
    const supabase = createClient();
    const { error } = await supabase
      .from('registrations')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg));
    }
  };

  const handleExportToCSV = () => {
    // Define headers
    const headers = ["Registration ID", "Player Name", "Category", "Event", "Location", "Gender", "DOB", "Phone", "Partner", "Status", "Date Registered"];
    
    // Map rows
    const rows = filteredRegs.map(reg => [
      reg.id.split('-')[0], // Short ID
      `"${reg.player_name || reg.profiles?.full_name || 'Unknown'}"`,
      `"${reg.category}"`,
      `"${reg.event_type || ''}"`,
      `"${reg.location || ''}"`,
      `"${reg.gender || ''}"`,
      `"${reg.dob || ''}"`,
      `"${reg.whatsapp_no || reg.profiles?.phone || ''}"`,
      `"${reg.partner_name || ''}"`,
      `"${reg.status}"`,
      `"${new Date(reg.created_at).toLocaleDateString()}"`
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Create Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shuttlers_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadDraws = async (e: React.ChangeEvent<HTMLInputElement>, tournamentId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDraw(tournamentId);
    const supabase = createClient();
    
    // Upload file
    const fileExt = file.name.split('.').pop();
    const fileName = `${tournamentId}-draws-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('draws')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      alert("Error uploading file: " + uploadError.message);
      setUploadingDraw(null);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('draws')
      .getPublicUrl(fileName);

    // Save to tournament
    const { error: updateError } = await supabase
      .from('tournaments')
      .update({ draws_url: publicUrl })
      .eq('id', tournamentId);

    if (updateError) {
      alert("Error saving draw link: " + updateError.message);
    } else {
      setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, draws_url: publicUrl } : t));
      alert("Draws successfully uploaded!");
    }
    setUploadingDraw(null);
  };

  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#0a1128]" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1128] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // Filter registrations by search term (name, email, or category)
  const filteredRegs = registrations.filter(reg => {
    const term = searchTerm.toLowerCase();
    const nameMatch = reg.profiles?.full_name?.toLowerCase().includes(term);
    const phoneMatch = reg.profiles?.phone?.toLowerCase().includes(term);
    const categoryMatch = reg.category.toLowerCase().includes(term);
    const partnerMatch = reg.partner_name?.toLowerCase().includes(term);
    return nameMatch || phoneMatch || categoryMatch || partnerMatch;
  });

  return (
    <div className="min-h-screen bg-[#0a1128] text-white font-sans relative">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a1128]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
          </div>
        </div>
        
        <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
          <span className="text-xs font-bold text-gray-300">ADMIN: rishavray05@gmail.com</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-16 h-16" />
            </div>
            <h3 className="text-sm font-bold text-gray-400 mb-1">Total Registrations</h3>
            <p className="text-4xl font-black text-white">{registrations.length}</p>
          </div>
          
          {tournaments.map(t => (
            <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden md:col-span-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-1">Tournament Draws</h3>
                <p className="text-lg font-bold text-white">{t.name}</p>
                {t.draws_url ? (
                  <a href={t.draws_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-1 block">View Current Draws</a>
                ) : (
                  <p className="text-xs text-amber-400 mt-1 block">No draws uploaded yet</p>
                )}
              </div>
              <div>
                <label className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-600/20">
                  {uploadingDraw === t.id ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload Draws</>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={e => handleUploadDraws(e, t.id)}
                    disabled={uploadingDraw === t.id}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Registration Data</h2>
            <button 
              onClick={handleExportToCSV}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search players, emails, categories..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                  <th className="px-6 py-4 font-bold">Player Details</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Category & Event</th>
                  <th className="px-6 py-4 font-bold">Status & Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRegs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No registrations found matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredRegs.map((reg) => (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm mb-0.5">
                          {reg.player_name || reg.profiles?.full_name || 'Unknown'}
                        </div>
                        <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1.5">ID: {reg.id.split('-')[0]}</p>
                        <div className="flex flex-col gap-1 text-xs text-gray-400">
                          {reg.gender && <span>{reg.gender} • DOB: {reg.dob}</span>}
                          <div className="flex items-center gap-1.5 mt-1">
                            <Phone className="w-3 h-3 text-green-400" /> 
                            <span className="text-gray-300">{reg.whatsapp_no || reg.profiles?.phone || 'N/A'}</span>
                            {(reg.whatsapp_no || reg.profiles?.phone) && (
                              <a 
                                href={`https://wa.me/${(reg.whatsapp_no || reg.profiles?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${reg.player_name || reg.profiles?.full_name || ''}! Regarding your registration for the Shuttlers Badminton Tournament...`)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 bg-[#25D366]/20 hover:bg-[#25D366]/40 text-[#25D366] p-1 rounded-full transition-colors group relative"
                                title="Message on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-300">
                          {reg.location || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="w-fit bg-blue-500/20 text-blue-300 border border-blue-500/20 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                            {reg.category}
                          </span>
                          <span className="text-xs font-semibold text-gray-400 uppercase">
                            Event: {reg.event_type || 'Unknown'}
                          </span>
                          {reg.partner_name && (
                            <div className="text-xs text-blue-400 font-semibold mt-1">
                              Partner: {reg.partner_name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`w-fit px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            reg.status === 'registered' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            reg.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {reg.status}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(reg.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleToggleStatus(reg.id, reg.status)}
                            className={`p-2 rounded-lg transition-colors group ${reg.status === 'confirmed' ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500' : 'bg-green-500/10 hover:bg-green-500/20 text-green-500'}`}
                            title={reg.status === 'confirmed' ? "Mark as Unpaid" : "Confirm Payment"}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors group"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
