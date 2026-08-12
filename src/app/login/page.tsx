"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage('Login successful! Redirecting...');
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent! Check your inbox.');
    }
    setLoading(false);
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

        {/* Right Side: Login Box */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            {/* Subtle Inner Glow Border Effect */}
            <div className="absolute inset-0 border border-blue-500/20 rounded-3xl pointer-events-none group-hover:border-blue-500/40 transition-colors duration-500" />
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-blue-500/20 rotate-6">
              {/* Custom Logo/Icon */}
              <img src="/logo1.jpg" alt="Logo" className="w-full h-full object-cover rounded-2xl -rotate-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-1.5 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Welcome Back
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Enter your credentials to access your Shuttlers account
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-2 text-green-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
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

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
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
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0e1634] px-3 text-slate-400 font-semibold tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Social Sign In Options */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              Apple ID
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400 mt-8 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">Create one</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
