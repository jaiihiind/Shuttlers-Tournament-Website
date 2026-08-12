"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1128] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors font-extrabold text-xs tracking-wider bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK TO HOME
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center relative z-10 px-4 lg:px-12 pt-24 pb-12 lg:py-16 w-full max-w-[1400px] mx-auto gap-12 lg:gap-24">
        
        {/* Left Side: Image */}
        <div className="w-full lg:w-1/2 justify-center lg:justify-end hidden md:flex">
          <div className="w-full max-w-md lg:max-w-lg h-[400px] lg:h-[520px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-black/20">
            <img 
              src="/login%20page%20pic.jpg" 
              alt="Badminton Tournament" 
              className="w-full h-full object-cover mix-blend-screen opacity-90" 
            />
          </div>
        </div>

        {/* Right Side: Sign Up Box */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            {/* Subtle Inner Glow Border Effect */}
            <div className="absolute inset-0 border border-blue-500/20 rounded-3xl pointer-events-none group-hover:border-blue-500/40 transition-colors duration-500" />
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-blue-500/20 rotate-6">
              <img src="/logo1.jpg" alt="Logo" className="w-full h-full object-cover rounded-2xl -rotate-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-1.5 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Join Shuttlers
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Create your account and start competing
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Check Your Email!</h3>
              <p className="text-sm text-slate-400 mb-6">
                We&apos;ve sent a confirmation link to <span className="text-white font-semibold">{email}</span>. Click it to activate your account.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold py-3 px-6 rounded-2xl uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Lovish Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+91 77195 24122"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] uppercase text-xs tracking-widest mt-1 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Login Link */}
          {!success && (
            <p className="text-center text-sm text-slate-400 mt-8 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">Sign in</Link>
            </p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
