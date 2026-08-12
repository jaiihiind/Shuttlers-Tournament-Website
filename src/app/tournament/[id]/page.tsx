"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Mail, ExternalLink, Phone, X, AlertCircle, CheckCircle, Loader2, Calendar } from 'lucide-react';
import Grainient from '@/components/Grainient';
import { createClient } from '@/lib/supabase/client';

export default function TournamentPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Registration Modal State
  const router = useRouter();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [partnerNames, setPartnerNames] = useState<Record<string, string>>({});
  
  // New Extended Fields
  const [playerName, setPlayerName] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [drawsUrl, setDrawsUrl] = useState<string | null>(null);

  const categories = [
    "U - 11", "U - 13", "U - 15", "U - 15 XD", "U - 17", "U - 19",
    "Open Category",
    "Open Singles - 30+", "Open Singles - 40+", "Open Singles - 50+",
    "Open Doubles 70+", "Open Doubles 80+", "Open Doubles 90+", "Open Doubles 100+", "Open Doubles 120+", "Open Doubles 130+"
  ];
  
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  
  // Set tournament name to Shuttlers Badminton Tournament
  const tournamentName = "Shuttlers Badminton Tournament";
  const tournamentId = unwrappedParams.id === 'summer-smash-2026' 
      ? '11111111-1111-1111-1111-111111111111' 
      : unwrappedParams.id;

  React.useEffect(() => {
    const fetchTournament = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('tournaments').select('draws_url').eq('id', tournamentId).single();
      if (data?.draws_url) {
        setDrawsUrl(data.draws_url);
      }
    };
    fetchTournament();
  }, [tournamentId]);

  const tabs = ["Overview", "Matches", "Social"];

  const handleRegisterClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=/tournament/${unwrappedParams.id}`);
      return;
    }
    setPlayerName(user.user_metadata?.full_name || '');
    setIsRegisterModalOpen(true);
  };

  const submitRegistration = async () => {
    if (selectedCategories.length === 0) {
      setRegisterError("Please select at least one category");
      return;
    }
    if (!playerName || !whatsappNo || !dob || !gender || !eventType) {
      setRegisterError("Please fill out all required fields");
      return;
    }
    setIsRegistering(true);
    setRegisterError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setRegisterError("You must be logged in to register.");
      setIsRegistering(false);
      return;
    }

    if (!user) {
      setRegisterError("You must be logged in to register.");
      setIsRegistering(false);
      return;
    }

    // Auto-create tournament to prevent foreign key errors if the user hasn't run the seed script
    await supabase.from('tournaments').upsert({
      id: tournamentId,
      name: tournamentName,
      organizer_id: user.id
    }, { onConflict: 'id' }).select();

    // Prepare all registration records
    const records = selectedCategories.map(cat => ({
      tournament_id: tournamentId,
      player_id: user.id,
      category: cat,
      player_name: playerName,
      whatsapp_no: whatsappNo,
      dob: dob,
      gender: gender,
      event_type: eventType,
      location: location,
      partner_name: (eventType === 'Doubles' || eventType === 'Both') ? (partnerNames['global'] || null) : null
    }));

    const { data, error } = await supabase.from('registrations').insert(records).select();

    if (error) {
      if (error.code === '23505') {
        setRegisterError("You are already registered for this category!");
      } else {
        setRegisterError(error.message);
      }
      setIsRegistering(false);
    } else if (data && data.length > 0) {
      // Use the first part of the UUID as a readable registration code
      const uniqueId = data[0].id.split('-')[0].toUpperCase();
      setRegistrationId(uniqueId);
      setRegisterSuccess(true);
      setIsRegistering(false);
      // Wait for user to manually close or click finish to go to dashboard
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 text-gray-900 font-sans z-0">
      
      {/* Animated Grainient Background */}
      <div className="absolute inset-0 w-full h-full -z-20 opacity-40 pointer-events-none">
        <Grainient
          color1="#7dd3fc"
          color2="#60a5fa"
          color3="#a5b4fc"
          timeSpeed={0.15}
        />
      </div>

      {/* Top Banner & Header Section */}
      <div className="relative text-white overflow-hidden">
        {/* Blurred Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105"
          style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(26, 26, 26, 0.4)), url('/header%20logo.jpg')` }}
        />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <Link href="/" className="inline-flex items-center text-white hover:text-gray-200 transition-colors font-extrabold text-xs tracking-wide bg-black px-3 py-1 rounded-full mb-1 mt-1">
            <ArrowLeft className="w-3 h-3 mr-1" />
            BACK TO HOME
          </Link>
          
          <div className="flex flex-row gap-3 items-end mb-1">
            {/* Poster Image */}
            <div className="w-12 h-16 md:w-16 md:h-24 bg-gray-800 rounded-lg overflow-hidden shrink-0 border border-gray-700 shadow-xl relative">
              {/* Tournament logo */}
              <img src="/logo%20tournament.jpeg" alt="Tournament Logo" className="w-full h-full object-cover" />
            </div>
            
            {/* Tournament Details */}
            <div className="pb-1">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-widest mb-0.5 text-white uppercase drop-shadow-2xl" style={{ fontFamily: 'var(--font-luckiest-guy)', textShadow: '2px 4px 6px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)', letterSpacing: '0.12em' }}>
                {tournamentName}
              </h1>
              <p className="text-sm md:text-base text-gray-200 max-w-2xl drop-shadow-md hidden sm:block font-medium">
                The ultimate badminton showdown. Join us for a weekend of intense competition.
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-1 items-end relative z-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-6 py-3 font-semibold text-sm rounded-t-md transition-colors whitespace-nowrap
                    ${isActive 
                      ? 'bg-[#f0f0f0] text-gray-900 border-t-2 border-l-2 border-r-2 border-transparent' 
                      : 'bg-gray-500/80 hover:bg-gray-500 text-white border-t border-l border-r border-transparent hover:text-white'}
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Full width light bar underneath the tabs */}
        <div className="h-14 bg-[#f0f0f0] w-full absolute bottom-0 left-0 -z-10 translate-y-full"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 relative z-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tab Content */}
        <div className="lg:col-span-2">
          {activeTab === 'Overview' && (
            <div className="p-5 md:p-6 bg-white rounded-3xl shadow-sm border border-gray-100 mt-2">
              
              {/* Banner with border inside the Overview */}
              <div className="w-full h-auto rounded-2xl border-4 border-gray-100 shadow-sm overflow-hidden mb-6">
                <img src="/banner.jpg.jpeg" alt="Tournament Banner" className="w-full h-auto object-contain" />
              </div>

              <h2 className="text-2xl font-bold mb-5 text-gray-900 flex items-center gap-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Info</span>
                About this Event
              </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700">
              {/* Left Column: Logistics */}
              <div className="space-y-4">
                {/* Overview Card */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-2xl border border-blue-100 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base font-extrabold text-blue-700 flex items-center gap-2 mb-3 uppercase tracking-wide">
                    📅 Overview
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 shrink-0">DATE</span>
                      <span className="font-semibold text-gray-800">23rd August 2026</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 shrink-0">VENUE</span>
                      <span className="text-gray-700">Chandigarh Badminton Academy, Nabha, Zirakpur.</span>
                    </div>
                    <a href="https://maps.app.goo.gl/4tARgPaVGnDGVGGB7?g_st=ac" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs hover:underline bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors">
                      📍 Open in Maps →
                    </a>
                  </div>
                </div>

                {/* Match Details Card */}
                <div className="bg-gradient-to-r from-amber-50 to-white p-5 rounded-2xl border border-amber-100 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base font-extrabold text-amber-700 flex items-center gap-2 mb-3 uppercase tracking-wide">
                    🏸 Match Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span><strong className="text-gray-900">Shuttlecock:</strong> Yonex Mavis 350</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span><strong className="text-gray-900">Format:</strong> Knockout (15 × 3 set)</span>
                    </div>
                    <p className="text-[11px] text-amber-600 italic ml-4 bg-amber-50 px-2 py-1 rounded-lg inline-block">Golden points @ 20 — no deuce after that</p>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span><strong className="text-gray-900">ID Proof:</strong> Aadhar card mandatory</span>
                    </div>
                  </div>
                </div>

                {/* Perks Card */}
                <div className="bg-gradient-to-r from-emerald-50 to-white p-5 rounded-2xl border border-emerald-100 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base font-extrabold text-emerald-700 flex items-center gap-2 mb-3 uppercase tracking-wide">
                    🎁 Perks & Highlights
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="text-emerald-500 text-base">✓</span>
                      <span className="font-medium text-gray-800">Cash Prizes, Trophies & Medals</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-emerald-500 text-base">✓</span>
                      <span className="font-medium text-gray-800">Certificates for all participants</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-emerald-500 text-base">✓</span>
                      <span className="font-medium text-gray-800">9 Premium Indoor Courts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Fees and Deadlines */}
              <div className="space-y-4">
                {/* Entry Fees Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100 border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base font-extrabold text-indigo-700 flex items-center gap-2 mb-4 uppercase tracking-wide">
                    💰 Entry Fees
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border border-indigo-100">
                      <span className="font-semibold text-gray-700">Singles</span>
                      <span className="text-xl font-black text-indigo-700">₹600</span>
                    </div>
                    <div className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border border-indigo-100">
                      <span className="font-semibold text-gray-700">Doubles / Mix</span>
                      <span className="text-xl font-black text-indigo-700">₹1000</span>
                    </div>
                  </div>
                </div>

                {/* Deadline Card */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 p-5 rounded-2xl border border-red-200 border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base font-extrabold text-red-700 flex items-center gap-2 mb-2 uppercase tracking-wide">
                    🚨 Last Date of Entry
                  </h3>
                  <p className="text-2xl font-black text-red-800 mb-1">20th August 2026</p>
                  <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    ⏳ Limited Slots Available!
                  </span>
                </div>
              </div>
            </div>
            </div>
          )}
          
          {activeTab === 'Social' && (
            <div className="p-6 md:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 mt-2">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3 flex items-center gap-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Gallery</span>
                Tournament Maps
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((num) => (
                  <div 
                    key={num} 
                    onClick={() => setSelectedImage(num)}
                    className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border-[6px] border-white aspect-[4/3] cursor-pointer"
                  >
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121845]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                        <div className="bg-blue-500 p-2 rounded-full">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <span className="text-white font-bold tracking-wide">
                          Click to Expand Map {num}
                        </span>
                      </div>
                    </div>
                    {/* Image */}
                    <img 
                      src={`/map%20pics/map%20${num}.png`} 
                      alt={`Tournament Map ${num}`} 
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Matches' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-2 overflow-hidden flex flex-col items-center">
              {drawsUrl ? (
                drawsUrl.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-[600px] md:h-[800px] flex flex-col">
                    <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
                      <h3 className="font-bold text-blue-900">Tournament Draws (PDF)</h3>
                      <a href={drawsUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors">
                        Open PDF
                      </a>
                    </div>
                    <iframe src={drawsUrl} className="w-full h-full border-0" title="Tournament Draws" />
                  </div>
                ) : (
                  <div className="w-full p-4 md:p-6 bg-gray-50 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800">Tournament Draws</h3>
                      <a href={drawsUrl} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors">
                        View Full Screen
                      </a>
                    </div>
                    <img src={drawsUrl} alt="Tournament Draws" className="w-full h-auto object-contain rounded-xl border border-gray-200 shadow-md" />
                  </div>
                )
              ) : (
                <div className="p-12 w-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Draws Not Available Yet</h3>
                  <p className="text-gray-500 max-w-sm">
                    The tournament organizer hasn't uploaded the match fixtures or brackets yet. Check back closer to the tournament date!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Social' && (
            <div className="flex flex-col gap-6 mt-2">
              {/* Sponsors Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                  <span className="text-yellow-500">🏆</span> Official Sponsors
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                    <p className="font-bold text-gray-400">Sponsor 1</p>
                  </div>
                  <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                    <p className="font-bold text-gray-400">Sponsor 2</p>
                  </div>
                  <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                    <p className="font-bold text-gray-400 text-center text-sm">Become a<br/>Sponsor!</p>
                  </div>
                </div>
              </div>

              {/* Vendors Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                  <span className="text-orange-500">🍔</span> Food & Vendors
                </h2>
                <div className="flex flex-col gap-3">
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-orange-900">Food Stalls Available</h4>
                      <p className="text-sm text-orange-700">Snacks, Energy Drinks, and Meals</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram Feed / Links */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 md:p-8 shadow-sm border border-pink-100 text-center">
                <h2 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Follow the Action</h2>
                <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">Tag us in your photos and stories using the official tournament hashtag!</p>
                <div className="inline-block bg-white px-6 py-3 rounded-full font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm border border-pink-100 text-xl tracking-wider">
                  #SUMMERSMASH26
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4 mt-2">
          
          {/* Register Button - Moved to Top */}
          <button onClick={handleRegisterClick} className="block w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base rounded-full shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl focus:ring-4 focus:ring-blue-500/50 tracking-wide text-center uppercase">
            REGISTER NOW
          </button>

          {activeTab === 'Overview' && (
            <>
              {/* Venue Card */}
              {/* Venue Card */}
              <div className="group bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-sky-100 overflow-hidden relative">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors pointer-events-none"></div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shadow-sm">
                        <MapPin size={18} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-sm font-extrabold text-gray-900 tracking-wide uppercase">Venue</h3>
                    </div>
                    <a href="https://maps.app.goo.gl/4tARgPaVGnDGVGGB7?g_st=ac" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-600 hover:text-white rounded-full transition-colors shadow-sm">
                      ROUTE <ExternalLink size={10} />
                    </a>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Chandigarh Badminton Academy</h4>
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400" /> Nabha, Zirakpur
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="group bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-indigo-100 overflow-hidden relative mt-4">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none"></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl shadow-sm">
                      <Phone size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-extrabold text-gray-900 tracking-wide uppercase">Contacts</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between group/contact p-2.5 -mx-2 rounded-xl hover:bg-white/60 transition-colors">
                      <span className="text-sm font-bold text-gray-900">Lovish Sharma</span>
                      <a href="tel:7719524122" className="text-xs font-bold text-indigo-600 bg-white shadow-sm border border-indigo-100 px-3 py-1.5 rounded-full group-hover/contact:bg-indigo-600 group-hover/contact:text-white transition-colors">7719524122</a>
                    </div>
                    <div className="flex items-center justify-between group/contact p-2.5 -mx-2 rounded-xl hover:bg-white/60 transition-colors">
                      <span className="text-sm font-bold text-gray-900">Aditya Garg</span>
                      <a href="tel:9914338648" className="text-xs font-bold text-indigo-600 bg-white shadow-sm border border-indigo-100 px-3 py-1.5 rounded-full group-hover/contact:bg-indigo-600 group-hover/contact:text-white transition-colors">9914338648</a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <X size={28} />
            </button>
            <img 
              src={`/map%20pics/map%20${selectedImage}.png`} 
              alt={`Tournament Map ${selectedImage}`} 
              className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border-4 border-white/10" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Register</h2>
              <p className="text-gray-500 text-sm mt-1">{tournamentName}</p>
            </div>

            {registerSuccess ? (
              <div className="text-center py-4 animate-in zoom-in duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Registered Successfully!</h3>
                
                <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Your Registration ID</p>
                  <p className="text-xl font-black text-blue-700 tracking-widest">{registrationId}</p>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">Complete Your Payment</h4>
                  <p className="text-xs text-gray-500 mb-3">(ignore if done)</p>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <img src="/payment scanner.jpg" alt="Payment QR Code" className="w-48 h-48 mx-auto rounded-lg shadow-sm border border-gray-200 object-contain mb-3" />
                    <p className="text-xs text-gray-500 font-semibold mb-1">Scan to pay or use UPI ID:</p>
                    <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 inline-block">
                      <p className="text-sm font-mono font-bold text-gray-800">notesforall25-1@okhdfcbank</p>
                    </div>
                    <p className="text-[10px] text-red-500 font-bold mt-3 uppercase">⚠️ Please include your Registration ID ({registrationId}) in the payment notes!</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setIsRegisterModalOpen(false);
                    setRegisterSuccess(false);
                    setRegistrationId(null);
                    router.push('/dashboard');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30"
                >
                  I've Paid / Finish
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {registerError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {registerError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Your full name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">WhatsApp No. <span className="text-red-500">*</span></label>
                    <input type="text" value={whatsappNo} onChange={e => setWhatsappNo(e.target.value)} placeholder="+91 9999999999" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">Date of Birth <span className="text-red-500">*</span></label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">Gender <span className="text-red-500">*</span></label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">Event Type <span className="text-red-500">*</span></label>
                    <select value={eventType} onChange={e => setEventType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                      <option value="" disabled>Select Event</option>
                      <option value="Singles">Singles</option>
                      <option value="Doubles">Doubles</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">City / Location</label>
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Where are you coming from?" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">Select Categories <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <label key={cat} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedCategories.includes(cat) 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          selectedCategories.includes(cat) ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                        }`}>
                          {selectedCategories.includes(cat) && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{cat}</span>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => {
                            setSelectedCategories(prev => 
                              prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                            );
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {(eventType === 'Doubles' || eventType === 'Both') && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">Partner Details</label>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600">Doubles Partner's Name</label>
                      <input 
                        type="text" 
                        value={partnerNames['global'] || ''}
                        onChange={e => setPartnerNames({ 'global': e.target.value })}
                        placeholder={`Enter partner's full name`}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                <button 
                  onClick={submitRegistration}
                  disabled={isRegistering}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 uppercase tracking-widest mt-4 flex items-center justify-center gap-2"
                >
                  {isRegistering ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                  ) : (
                    'Confirm Registration'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
