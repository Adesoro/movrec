'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_KEY, IMAGE_BASE } from '@/config/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  // Live search with cleanup
  useEffect(() => {
    let isMounted = true;
    const searchMovies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setSearchError(null);
        return;
      }

      try {
        setIsSearching(true);
        setSearchError(null);
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery.trim())}&language=en-US&page=1`
        );
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch search results');
        }
        
        if (isMounted) {
          setSearchResults(data.results);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred while searching';
          setSearchError(errorMessage);
          setSearchResults([]);
          console.error('Error searching movies:', err);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    const debounceTimer = setTimeout(searchMovies, 300);
    return () => {
      clearTimeout(debounceTimer);
      isMounted = false;
    };
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    // Add your sign out logic here, e.g., clearing tokens, etc.
    router.push('/');
  };

  // Don't render Navbar on login and register pages
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#1a1a2e]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">CineMax</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              href="/home" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/home' ? 'text-[#ff6347] border-b-2 border-[#ff6347]' : 'text-white hover:text-[#ff6347] hover:border-b-2 hover:border-[#ff6347]'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/profile" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/profile' ? 'text-[#ff6347] border-b-2 border-[#ff6347]' : 'text-white hover:text-[#ff6347] hover:border-b-2 hover:border-[#ff6347]'
              }`}
            >
              Profile
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                placeholder="Search movies..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#ff6347]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                )}
              </button>
              
              {showResults && (searchQuery.trim() || searchResults.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a4a] rounded-lg shadow-lg overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
                  {searchError ? (
                    <div className="p-4 text-red-400 text-sm">{searchError}</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-gray-400 text-sm">No results found</div>
                  ) : (
                    searchResults.map((movie) => (
                  <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-[#3a3a5a] transition-colors"
                    onClick={() => {
                          setShowResults(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="relative w-16 h-24 flex-shrink-0">
                          <Image
                            src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : '/images/no-poster.png'}
                            alt={movie.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">{movie.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <span className="text-yellow-400">★</span>
                            <span>{movie.vote_average.toFixed(1)}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                          </div>
                          {movie.overview && (
                            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                              {movie.overview}
                            </p>
                          )}
                </div>
                      </Link>
                    ))
                  )}
              </div>
            )}
            </form>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-[#ff6347] text-white rounded-lg hover:bg-[#ff6347]/90 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
} 