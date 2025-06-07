'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MovieCard from '@/components/MovieCard';
import { API_KEY, IMAGE_BASE } from '@/config/api';

interface RatedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  userRating: number;
}

export default function Profile() {
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      // Load rated movies
      loadUserRatings();

      // Load recently viewed movies directly from localStorage
      const recentlyViewedData = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(recentlyViewedData);
    };

    loadUserData();
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentlyViewed([]);
  };

  const loadUserRatings = () => {
    try {
      const ratings: { movieId: string; rating: string }[] = [];
      
      // Get all items from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        // Check if the key follows the pattern 'userRating-{movieId}'
        if (key.startsWith('userRating-')) {
          const movieId = key.replace('userRating-', '');
          const rating = localStorage.getItem(key);
          
          // Validate rating
          if (rating && !isNaN(Number(rating)) && Number(rating) >= 0 && Number(rating) <= 5) {
            ratings.push({
              movieId,
              rating
            });
          } else {
            // Remove invalid rating
            localStorage.removeItem(key);
          }
        }
      }

      // Sort ratings by most recent (assuming movieId contains timestamp)
      ratings.sort((a, b) => Number(b.movieId) - Number(a.movieId));

      // Display empty state if no ratings found
      if (ratings.length === 0) {
        setRatedMovies([]);
        return;
      }

      // Fetch details for each rated movie
      const fetchMovieDetails = async () => {
        const movieDetails = await Promise.all(
          ratings.map(async (item) => {
            try {
              const response = await fetch(
                `https://api.themoviedb.org/3/movie/${item.movieId}?api_key=${API_KEY}`
              );
              if (!response.ok) throw new Error('Failed to fetch movie details');
              const movie = await response.json();
              return {
                ...movie,
                userRating: Number(item.rating)
              };
            } catch (error) {
              console.error(`Error fetching movie ${item.movieId}:`, error);
              return null;
            }
          })
        );

        // Filter out failed fetches and update state
        setRatedMovies(movieDetails.filter((movie): movie is RatedMovie => movie !== null));
      };

      fetchMovieDetails();
    } catch (error) {
      console.error('Error loading user ratings:', error);
      setRatedMovies([]);
    }
  };

  const clearAllRatings = () => {
    try {
      // Get all rating keys
      const ratingKeys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
        .filter((key): key is string => key?.startsWith('userRating-') ?? false);

      // Remove all rating entries
      ratingKeys.forEach(key => localStorage.removeItem(key));
      
      // Update state
      setRatedMovies([]);
    } catch (error) {
      console.error('Error clearing ratings:', error);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[40vh] bg-cover bg-center" style={{ backgroundImage: 'url("/images/profile-bg.jpg")' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-4xl text-white/50"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hi, Adesoro Olufemisoro</h1>
              <p className="text-white/80 mt-1">Your movie journey continues...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* User Statistics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Your Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#2a2a4a] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">Movies Rated</h3>
              <p className="text-gray-400">{ratedMovies.length}</p>
            </div>
            <div className="bg-[#2a2a4a] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">Recently Viewed</h3>
              <p className="text-gray-400">{recentlyViewed.length}</p>
            </div>
            <div className="bg-[#2a2a4a] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">Average Rating</h3>
              <p className="text-gray-400">
                {ratedMovies.length > 0
                  ? (ratedMovies.reduce((acc, movie) => acc + movie.userRating, 0) / ratedMovies.length).toFixed(1)
                  : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* Ratings Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Ratings</h2>
          {ratedMovies.length > 0 && (
            <button
              onClick={clearAllRatings}
              className="text-[#ff6347] hover:text-[#ff4f2f] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <section className="mb-16 bg-[#2a2a4a] p-6 rounded-lg">
          {ratedMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {ratedMovies.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} />
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-sm">
                    Your rating: {movie.userRating}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">You haven't rated any movies yet.</p>
          )}
        </section>

        {/* Recently Viewed Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recently Viewed</h2>
          {recentlyViewed.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[#ff6347] hover:text-[#ff4f2f] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <section className="mb-16 bg-[#2a2a4a] p-6 rounded-lg">
          <div className="max-w-5xl mx-auto">
            {recentlyViewed.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {recentlyViewed.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No recently viewed movies.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
} 