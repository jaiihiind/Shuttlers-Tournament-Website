"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { User, LogOut, Calendar, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthNavButton() {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setIsOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="bg-white/20 text-transparent font-bold px-6 py-1.5 rounded-full text-sm mr-1 shrink-0 animate-pulse">
        Login
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all px-4 py-1.5 rounded-full text-sm shadow-md mr-1 shrink-0 hover:scale-[1.03] active:scale-[0.97]"
        >
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Avatar" 
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {user.user_metadata?.full_name?.split(' ')[0] || 'Profile'}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user.user_metadata?.full_name || 'Player'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            
            <div className="p-2">
              {user.email === 'rishavray05@gmail.com' && (
                <Link 
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors mb-1"
                >
                  <Shield className="w-4 h-4 text-purple-500" />
                  Admin Portal
                </Link>
              )}
              
              <Link 
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Calendar className="w-4 h-4 text-blue-500" />
                My Tournaments
              </Link>
            </div>
            
            <div className="p-2 border-t border-gray-100">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link 
      href="/login" 
      className="bg-white text-black hover:bg-gray-200 font-bold transition-colors px-6 py-1.5 rounded-full text-sm shadow-md mr-1 shrink-0"
    >
      Login
    </Link>
  );
}
