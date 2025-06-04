'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically make an API call to register the user
    // For demo purposes, we'll just redirect to home
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Form */}
      <div className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("/images/register-bg.jpg")' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a2a4a]/90"></div>
        
        <div className="relative z-10 w-full max-w-md p-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-white text-center mb-2">Sign Up</h1>
            <p className="text-white/80 text-center mb-8">Discover your next favorite movie</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-white mb-2">
                  Full name
                </label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-white/50"></i>
                  <input
                    id="fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    placeholder="Adesoro Olufemisoro"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/50"></i>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    placeholder="femi@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/50"></i>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    placeholder="at least 8 characters"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#ff6347] text-white rounded-lg hover:bg-[#ff4f2f] transition-colors font-medium"
              >
                Create account
              </button>

              <div className="text-center text-sm text-white/80">
                Already have an account?{' '}
                <Link href="/login" className="text-[#ff6347] hover:text-[#ff4f2f] transition-colors">
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1a1a2e] mb-4">How CineMax Works</h2>
          <p className="text-gray-600 text-center mb-12">
            Get personalized movie recommendations in 5 simple steps:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                icon: 'fa-user-plus',
                title: 'Step 1',
                description: 'Create a free account to get started.'
              },
              {
                icon: 'fa-sign-in-alt',
                title: 'Step 2',
                description: 'Login to your account'
              },
              {
                icon: 'fa-search',
                title: 'Step 3',
                description: 'Search for a movie you love (e.g. Inception).'
              },
              {
                icon: 'fa-magic',
                title: 'Step 4',
                description: 'Get instant, AI-powered recommendations.'
              },
              {
                icon: 'fa-star',
                title: 'Step 5',
                description: 'Rate your favorite movies to get more accurate suggestions.'
              }
            ].map((step, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
              >
                <i className={`fas ${step.icon} text-3xl text-[#ff6347] mb-4`}></i>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 