'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically make an API call to authenticate
    // For demo purposes, we'll just redirect to home
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("/images/login-bg.jpg")' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a2a4a]/90"></div>
      
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white text-center mb-2">Sign in</h1>
          <p className="text-white/80 text-center mb-8">Discover your next favorite movie</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                placeholder="femi@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                placeholder="Your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#ff6347] text-white rounded-lg hover:bg-[#ff4f2f] transition-colors font-medium"
            >
              Sign in
            </button>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="text-center text-sm text-white/80">
              New to CineMax?{' '}
              <Link href="/register" className="text-[#ff6347] hover:text-[#ff4f2f] transition-colors">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 