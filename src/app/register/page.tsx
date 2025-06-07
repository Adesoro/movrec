'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to register the user
      // For demo purposes, we'll just redirect to home
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      router.push('/');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/register-bg.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2a2a4a] opacity-95" />

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 flex items-center py-8">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Registration Form */}
              <div className="w-full max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Join CineMax</h2>
                    <p className="text-white/80">Create your account and start your movie journey</p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="fullname" className="block text-sm font-medium text-white mb-2">
                        Full name
                      </label>
                      <div className="relative group">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-[#ff6347] transition-colors" />
                        <input
                          id="fullname"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#ff6347] focus:ring-1 focus:ring-[#ff6347]/20 transition-all"
                          placeholder="Adesoro Olufemisoro"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <div className="relative group">
                        <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-[#ff6347] transition-colors" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#ff6347] focus:ring-1 focus:ring-[#ff6347]/20 transition-all"
                          placeholder="femi@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-[#ff6347] transition-colors" />
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#ff6347] focus:ring-1 focus:ring-[#ff6347]/20 transition-all"
                          placeholder="at least 8 characters"
                          minLength={8}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-[#ff6347] text-white rounded-lg hover:bg-[#ff4f2f] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Create account'
                      )}
                    </button>

                    <div className="text-center text-sm text-white/80">
                      Already have an account?{' '}
                      <Link href="/" className="text-[#ff6347] hover:text-[#ff4f2f] transition-colors font-medium">
                        Sign in
                      </Link>
                    </div>
                  </form>
                </div>
              </div>

              {/* How It Works Section */}
              <div className="w-full">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
                  <h2 className="text-3xl font-bold text-center text-white mb-4">How CineMax Works</h2>
                  <p className="text-white/80 text-center mb-8">
                    Get personalized movie recommendations in 5 simple steps:
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        icon: '🎬',
                        title: 'Create Account',
                        description: 'Sign up for free to get started.'
                      },
                      {
                        icon: '🔍',
                        title: 'Search Movies',
                        description: 'Find movies you love.'
                      },
                      {
                        icon: '✨',
                        title: 'Get Recommendations',
                        description: 'Receive AI-powered suggestions.'
                      },
                      {
                        icon: '⭐',
                        title: 'Rate Movies',
                        description: 'Rate to improve recommendations.'
                      }
                    ].map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10 transform hover:scale-[1.02] cursor-default"
                      >
                        <div className="text-3xl transform hover:scale-110 transition-transform">{step.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg text-white">{step.title}</h3>
                          <p className="text-white/80 text-sm">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 