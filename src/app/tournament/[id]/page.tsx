"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Mail, ExternalLink, Phone, X, AlertCircle, CheckCircle, Loader2, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Grainient from '@/components/Grainient';
import { createClient } from '@/lib/supabase/client';

function BannerCarousel() {
  const slides = [
    { id: 'chief-guest', src: '/sponsors/chief-guest.jpg', title: 'Chief Guest - Sardar Gurdarshan Singh Saini' },
    { id: 'delux-sports', src: '/sponsors/delux-sports.jpg', title: 'Delux Sports - Premier Badminton Hub' },
    { id: 'sani-dhaba', src: '/sponsors/sani-dhaba.jpg', title: 'Sani Dhaba - Food Partner' },
    { id: 'prize-pool', src: '/prize-pool.jpg', title: 'Prize Pool Up To ₹70,000' },
    { id: 'banner', src: '/banner.jpg.jpeg', title: 'Shuttlers Badminton Tournament 2026' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden shadow-xl border-2 border-gray-100 mb-6 group bg-gray-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sliding Track */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full shrink-0 relative flex items-center justify-center bg-gray-950 min-h-[240px] max-h-[460px]">
            <img 
              src={slide.src} 
              alt={slide.title} 
              className="w-full h-auto max-h-[460px] object-contain mx-auto" 
            />
          </div>
        ))}
      </div>

      {/* Slide Title Badge */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 tracking-wide uppercase pointer-events-none z-10">
        {slides[currentIndex].title}
      </div>

      {/* Controls */}
      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 z-10"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-6 bg-blue-500 shadow-sm shadow-blue-500/50' : 'w-2 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

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
  const [selectedFixtureCategory, setSelectedFixtureCategory] = useState('');
  const [fixtureLightboxOpen, setFixtureLightboxOpen] = useState(false);
  const [reportingLightboxOpen, setReportingLightboxOpen] = useState(false);

  const fixtureCategories = [
    { label: '100+ Mens Doubles', slug: '100-mens-doubles' },
    { label: '120+ Mens Doubles', slug: '120-mens-doubles' },
    { label: '130+ Mens Doubles', slug: '130-mens-doubles' },
    { label: '30+ Mens Singles', slug: '30-mens-singles' },
    { label: '40+ Mens Singles', slug: '40-mens-singles' },
    { label: '50+ Mens Singles', slug: '50-mens-singles' },
    { label: '70+ Mens Doubles', slug: '70-mens-doubles' },
    { label: '80+ Mens Doubles', slug: '80-mens-doubles' },
    { label: '90+ Mens Doubles', slug: '90-mens-doubles' },
    { label: 'Open Mens Doubles', slug: 'open-mens-doubles' },
    { label: 'Open Mens Singles', slug: 'open-mens-singles' },
    { label: 'Open Mix Doubles', slug: 'open-mix-doubles' },
    { label: 'Open Women Singles', slug: 'open-women-singles' },
    { label: 'U-11 Boys Doubles', slug: 'u11-boys-doubles' },
    { label: 'U-11 Boys Singles', slug: 'u11-boys-singles' },
    { label: 'U-11 Girls Singles', slug: 'u11-girls-singles' },
    { label: 'U-13 Boys Doubles', slug: 'u13-boys-doubles' },
    { label: 'U-13 Boys Singles', slug: 'u13-boys-singles' },
    { label: 'U-13 Girls Singles', slug: 'u13-girls-singles' },
    { label: 'U-15 Boys Doubles', slug: 'u15-boys-doubles' },
    { label: 'U-15 Boys Singles', slug: 'u15-boys-singles' },
    { label: 'U-15 Girls Doubles', slug: 'u15-girls-doubles' },
    { label: 'U-15 Girls Singles', slug: 'u15-girls-singles' },
    { label: 'U-15 Mix Doubles', slug: 'u15-mix-doubles' },
    { label: 'U-17 Boys Doubles', slug: 'u17-boys-doubles' },
    { label: 'U-17 Boys Singles', slug: 'u17-boys-singles' },
    { label: 'U-17 Girls Singles', slug: 'u17-girls-singles' },
    { label: 'U-19 Boys Doubles', slug: 'u19-boys-doubles' },
    { label: 'U-19 Boys Singles', slug: 'u19-boys-singles' },
    { label: 'U-19 Girls Doubles', slug: 'u19-girls-doubles' },
    { label: 'U-19 Girls Singles', slug: 'u19-girls-singles' },
  ];

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

  const tabs = ["Overview", "Matches", "Sponsors", "Social"];

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
              
              {/* Automated Sideways Transition Banner Carousel */}
              <BannerCarousel />

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
          
          {/* Note: Venue maps moved to Social tab section */}

          {activeTab === 'Matches' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-2 overflow-hidden">
              <div className="p-5 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Draws</span>
                  <h2 className="text-xl font-bold text-gray-900">Match Fixtures</h2>
                </div>

                {/* Category Dropdown */}
                <div className="relative mb-5">
                  <label className="text-xs font-extrabold tracking-wider text-gray-500 uppercase mb-2 block">Select Category</label>
                  <div className="relative">
                    <select
                      value={selectedFixtureCategory}
                      onChange={(e) => setSelectedFixtureCategory(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-blue-300 hover:bg-blue-50/30"
                    >
                      <option value="">— Choose a category to view draws —</option>
                      {fixtureCategories.map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Fixture Image Display */}
                {selectedFixtureCategory ? (
                  <div className="relative group">
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      {/* Category title bar */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 flex justify-between items-center">
                        <h3 className="text-white font-bold text-sm tracking-wide uppercase">
                          {fixtureCategories.find(c => c.slug === selectedFixtureCategory)?.label}
                        </h3>
                        <button
                          onClick={() => setFixtureLightboxOpen(true)}
                          className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                          Expand
                        </button>
                      </div>
                      {/* Image */}
                      <div
                        className="cursor-pointer"
                        onClick={() => setFixtureLightboxOpen(true)}
                      >
                        <img
                          src={`/fixtures/${selectedFixtureCategory}.png`}
                          alt={`Fixture - ${fixtureCategories.find(c => c.slug === selectedFixtureCategory)?.label}`}
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.fixture-error')) {
                              const errorDiv = document.createElement('div');
                              errorDiv.className = 'fixture-error flex flex-col items-center justify-center py-16 text-center';
                              errorDiv.innerHTML = `
                                <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                </div>
                                <h4 class="text-lg font-bold text-gray-800 mb-1">Fixture Coming Soon</h4>
                                <p class="text-gray-500 text-sm max-w-xs">The draw for this category hasn't been uploaded yet. Check back soon!</p>
                              `;
                              parent.appendChild(errorDiv);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gradient-to-b from-blue-50/50 to-white rounded-2xl border-2 border-dashed border-blue-200">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Select a Category</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Choose a category from the dropdown above to view the match fixtures and brackets.
                    </p>
                  </div>
                )}

                {/* Category count badge */}
                <div className="mt-4 flex justify-center">
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">
                    {fixtureCategories.length} categories available
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Fixture Lightbox */}
          {fixtureLightboxOpen && selectedFixtureCategory && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
              onClick={() => setFixtureLightboxOpen(false)}
            >
              <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="absolute -top-12 right-0 md:-right-2 flex items-center gap-3 z-10">
                  <span className="text-white/70 text-sm font-bold hidden md:block">
                    {fixtureCategories.find(c => c.slug === selectedFixtureCategory)?.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFixtureLightboxOpen(false);
                    }}
                    className="text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
                  >
                    <X size={28} />
                  </button>
                </div>
                <img
                  src={`/fixtures/${selectedFixtureCategory}.png`}
                  alt={`Fixture - ${fixtureCategories.find(c => c.slug === selectedFixtureCategory)?.label}`}
                  className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border-4 border-white/10"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Reporting Time Lightbox */}
          {reportingLightboxOpen && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
              onClick={() => setReportingLightboxOpen(false)}
            >
              <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="absolute -top-12 right-0 md:-right-2 flex items-center gap-3 z-10">
                  <span className="text-white/70 text-sm font-bold hidden md:block uppercase tracking-wider">
                    Reporting Time Schedule (23 August)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReportingLightboxOpen(false);
                    }}
                    className="text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
                  >
                    <X size={28} />
                  </button>
                </div>
                <img
                  src="/reporting-time.jpg"
                  alt="Reporting Time Schedule (23 August)"
                  className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border-4 border-white/10"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Sponsors Tab Content */}
          {activeTab === 'Sponsors' && (
            <div className="flex flex-col gap-6 mt-2">
              {/* Official Sponsors Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                  <div>
                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Partners</span>
                    <h2 className="text-2xl font-black text-gray-900 mt-2 flex items-center gap-2">
                      <span>🏆</span> Official Tournament Sponsors
                    </h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-amber-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                    <img src="/sponsors/chief-guest.jpg" alt="Chief Guest" className="w-full h-44 object-cover object-top" />
                    <div className="p-3 bg-amber-50">
                      <p className="font-extrabold text-amber-900 text-sm">Sardar Gurdarshan Singh Saini</p>
                      <span className="text-xs text-amber-700 font-bold uppercase">Chief Guest (BJP, Derabassi)</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-blue-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                    <img src="/sponsors/delux-sports.jpg" alt="Delux Sports" className="w-full h-44 object-cover object-top" />
                    <div className="p-3 bg-blue-50">
                      <p className="font-extrabold text-blue-900 text-sm">Delux Sports</p>
                      <span className="text-xs text-blue-700 font-bold uppercase">Sports Hub & Yonex Dealer</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                    <img src="/sponsors/sani-dhaba.jpg" alt="Sani Dhaba" className="w-full h-44 object-cover object-top" />
                    <div className="p-3 bg-emerald-50">
                      <p className="font-extrabold text-emerald-900 text-sm">Sani Dhaba</p>
                      <span className="text-xs text-emerald-700 font-bold uppercase">Official Food Partner</span>
                    </div>
                  </div>
                </div>

                {/* Become a Sponsor banner */}
                <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-lg">Interested in Sponsoring?</h3>
                    <p className="text-xs text-blue-100">Reach 500+ players & badminton enthusiasts</p>
                  </div>
                  <a href="tel:7719524122" className="bg-white text-blue-700 px-5 py-2.5 rounded-full font-bold text-xs shadow-md hover:bg-blue-50 transition-colors shrink-0">
                    Become a Sponsor →
                  </a>
                </div>
              </div>

              {/* Vendors Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2 border-b pb-4">
                  <span className="text-orange-500">🍔</span> Food, Refreshments & Stalls
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 flex items-start gap-3">
                    <div className="bg-orange-500 text-white p-2.5 rounded-xl shrink-0 font-bold text-lg">🍿</div>
                    <div>
                      <h4 className="font-bold text-orange-900 text-base">Food Stalls Available</h4>
                      <p className="text-sm text-orange-700 mt-1">Fresh Snacks, Energy Drinks, Fresh Juices & Meals served on-site throughout the event.</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-start gap-3">
                    <div className="bg-emerald-500 text-white p-2.5 rounded-xl shrink-0 font-bold text-lg">🎾</div>
                    <div>
                      <h4 className="font-bold text-emerald-900 text-base">Badminton Equipment Desk</h4>
                      <p className="text-sm text-emerald-700 mt-1">Stringing service, shuttles, grips & court accessories available at venue.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Tab Content */}
          {activeTab === 'Social' && (
            <div className="flex flex-col gap-6 mt-2">
              {/* Instagram & Social Media Channels */}
              <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-3xl p-6 md:p-8 shadow-sm border border-pink-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Social Hub</span>
                  <h2 className="text-2xl font-black text-gray-900">Follow & Share</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Stay connected with live tournament updates, match highlights, player photos, and announcements!</p>
                
                {/* Official Hashtag */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 text-center mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Official Tournament Hashtag</p>
                  <span className="inline-block font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 tracking-wider">
                    #SUMMERSMASH26
                  </span>
                  <p className="text-xs text-gray-500 mt-2">Tag us in your photos & stories to get featured!</p>
                </div>

                {/* Social Links Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white p-5 rounded-2xl border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-110 transition-transform">
                      📸
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm">Instagram</h4>
                    <p className="text-xs text-gray-500 mt-0.5">@shuttler.tournament</p>
                  </a>

                  <a href="https://wa.me/917719524122" target="_blank" rel="noopener noreferrer" className="bg-white p-5 rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-110 transition-transform">
                      💬
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm">WhatsApp Group</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Live Draw Updates</p>
                  </a>

                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-white p-5 rounded-2xl border border-red-100 hover:border-red-300 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-110 transition-transform">
                      ▶️
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm">YouTube Live</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Match Streams</p>
                  </a>
                </div>
              </div>

              {/* Venue Maps Gallery */}
              <div className="p-6 md:p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3 flex items-center gap-3">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Maps</span>
                  Venue Directions & Location Guides
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((num) => (
                    <div 
                      key={num} 
                      onClick={() => setSelectedImage(num)}
                      className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border-[6px] border-white aspect-[4/3] cursor-pointer"
                    >
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
                      <img 
                        src={`/map%20pics/map%20${num}.png`} 
                        alt={`Tournament Map ${num}`} 
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                      />
                    </div>
                  ))}
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

          {/* Reporting Time Schedule Card (Only on Matches tab) */}
          {activeTab === 'Matches' && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-blue-100 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shadow-sm">
                    <Clock size={18} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900 tracking-wide uppercase">Reporting Schedule</h3>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                  23 AUGUST
                </span>
              </div>
              <div 
                className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer group relative"
                onClick={() => setReportingLightboxOpen(true)}
              >
                <img 
                  src="/reporting-time.jpg" 
                  alt="Reporting Time Schedule (23 August)" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-gray-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                    🔍 Click to Expand
                  </span>
                </div>
              </div>
            </div>
          )}

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
