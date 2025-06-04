'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
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
      const ratedMoviesData: RatedMovie[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('movie_rating_')) {
          const movieId = key.replace('movie_rating_', '');
          const rating = parseInt(localStorage.getItem(key) || '0');
          
          try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
            const movieData = await response.json();
            ratedMoviesData.push({
              id: movieData.id,
              title: movieData.title,
              poster_path: movieData.poster_path,
              vote_average: movieData.vote_average,
              userRating: rating
            });
          } catch (error) {
            console.error('Error fetching movie details:', error);
          }
        }
      }
      setRatedMovies(ratedMoviesData);

      // Load recently viewed movies
      const recentlyViewedData = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const recentlyViewedMovies = [];
      
      for (const movieId of recentlyViewedData.slice(0, 20)) {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
          const movie = await response.json();
          recentlyViewedMovies.push(movie);
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      }
      
      setRecentlyViewed(recentlyViewedMovies);
    };

    loadUserData();
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentlyViewed([]);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

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
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Ratings Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Your Ratings</h2>
          {ratedMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
        <section className="bg-[#2a2a4a] -mx-4 px-4 py-12">
          <div className="max-w-7xl mx-auto">
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

            {recentlyViewed.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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