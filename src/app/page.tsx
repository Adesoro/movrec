'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_KEY, IMAGE_BASE } from '@/config/api';
import MovieSlider from '@/components/MovieSlider';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview?: string;
}

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch popular movies
        const popularResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        const popularData = await popularResponse.json();
        if (!popularResponse.ok) throw new Error(popularData.message || 'Failed to fetch popular movies');
        setPopularMovies(popularData.results);

        // Fetch trending movies
        const trendingResponse = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=en-US`
        );
        const trendingData = await trendingResponse.json();
        if (!trendingResponse.ok) throw new Error(trendingData.message || 'Failed to fetch trending movies');
        setTrendingMovies(trendingData.results);

        // Fetch top rated movies
        const topRatedResponse = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
        );
        const topRatedData = await topRatedResponse.json();
        if (!topRatedResponse.ok) throw new Error(topRatedData.message || 'Failed to fetch top rated movies');
        setTopRatedMovies(topRatedData.results);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching movies');
        console.error('Error fetching movies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery.trim())}&language=en-US&page=1`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch search results');
        setSearchResults(data.results); // Show all results
      } catch (err) {
        console.error('Error searching movies:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // No need to navigate to search page
  };

  if (error) {
  return (
      <div className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#ff6347] text-white rounded-lg hover:bg-[#ff6347]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e]">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-cover bg-center" style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a2a4a]/90"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Your Next Favorite Movie
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Explore a vast collection of movies, from timeless classics to the latest releases.
            </p>
            <div className="relative">
              <form onSubmit={handleSearch} className="flex gap-4 max-w-xl">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search for movies..."
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#ff6347] text-lg"
                  />
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a4a] rounded-lg shadow-lg overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
                      {searchResults.map((movie) => (
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
                              <StarIcon className="w-4 h-4 text-yellow-400" />
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
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#ff6347] text-white rounded-lg hover:bg-[#ff6347]/90 transition-colors text-lg font-medium"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Movies Section */}
        <MovieSlider
          movies={popularMovies}
          title="Popular Movies"
          isLoading={isLoading}
        />

        {/* Trending Movies Section */}
        <MovieSlider
          movies={trendingMovies}
          title="Trending Now"
          isLoading={isLoading}
        />

        {/* Top Rated Movies Section */}
        <MovieSlider
          movies={topRatedMovies}
          title="Top Rated Movies"
          isLoading={isLoading}
        />

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#2a2a4a] p-6 rounded-lg">
            <div className="w-12 h-12 bg-[#ff6347]/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#ff6347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Stream Anywhere</h3>
            <p className="text-gray-400">Watch your favorite movies on any device, anytime, anywhere.</p>
          </div>
          <div className="bg-[#2a2a4a] p-6 rounded-lg">
            <div className="w-12 h-12 bg-[#ff6347]/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#ff6347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Personalized Recommendations</h3>
            <p className="text-gray-400">Get movie suggestions tailored to your taste and preferences.</p>
          </div>
          <div className="bg-[#2a2a4a] p-6 rounded-lg">
            <div className="w-12 h-12 bg-[#ff6347]/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#ff6347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Rate & Review</h3>
            <p className="text-gray-400">Share your thoughts and discover what others think about movies.</p>
          </div>
        </section>
    </div>
    </main>
  );
}
