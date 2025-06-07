"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API_KEY, IMAGE_BASE } from '@/config/api';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PlaceholderImage from '@/components/PlaceholderImage';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
    }>;
  };
  similar: {
    results: Array<{
      id: number;
      title: string;
      poster_path: string;
      vote_average: number;
    }>;
  };
}

export default function MovieDetailsClient({ id }: { id: string }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First check if the API key is available
        if (!API_KEY) {
          throw new Error('API key is not configured');
        }

        // Fetch movie details with error handling
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,similar,videos`
        ).catch(err => {
          throw new Error('Network error: Unable to connect to the movie database');
        });

        // Parse the response
        const data = await response.json().catch(err => {
          throw new Error('Failed to parse movie data');
        });

        // Check for API errors
        if (!response.ok) {
          throw new Error(data.message || `Failed to fetch movie details (Status: ${response.status})`);
        }

        // Validate required data
        if (!data.id || !data.title) {
          throw new Error('Invalid movie data received');
        }

        setMovie(data);

        // Fetch user rating if available
        const savedRating = localStorage.getItem(`userRating-${id}`);
        if (savedRating) {
          setUserRating(Number(savedRating));
        }

        // Update recently viewed movies
        try {
          const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const updatedRecentlyViewed = [
            {
              id: data.id,
              title: data.title,
              poster_path: data.poster_path,
              vote_average: data.vote_average,
              release_date: data.release_date
            },
            ...recentlyViewed.filter((m: any) => m.id !== data.id)
          ].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
        } catch (err) {
          console.error('Error updating recently viewed movies:', err);
        }

      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred while fetching movie details';
        setError(errorMessage);
        console.error('Error fetching movie details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleRating = (rating: number) => {
    setUserRating(rating);
    localStorage.setItem(`userRating-${id}`, rating.toString());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-white">
        <div className="animate-pulse">
          <div className="h-[60vh] bg-gray-800"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-gray-800 rounded mb-8"></div>
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-[#ff6347] text-white rounded-lg hover:bg-[#ff6347]/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const director = movie.credits.crew.find(person => person.job === 'Director');
  const topCast = movie.credits.cast.slice(0, 4);

  return (
    <main className="min-h-screen pt-24">
      {/* Hero Banner */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${IMAGE_BASE}${movie.backdrop_path})` }}>
        <div className="absolute inset-0">
          <Image
            src={`${IMAGE_BASE}${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent"></div>
        </div>
        {/* Movie Info Overlay */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="relative w-48 h-72 flex-shrink-0">
              <PlaceholderImage
                src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null}
                alt={movie.title}
                fill
                className="object-cover rounded-lg shadow-xl"
                priority
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center gap-4 text-gray-300 mb-6">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-[#2a2a4a] rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="text-lg text-gray-300 max-w-3xl">{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Cast & Crew */}
          <div className="lg:col-span-2">
            {/* Cast Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topCast.map(person => (
                  <div key={person.id} className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <Image
                        src={person.profile_path ? `${IMAGE_BASE}${person.profile_path}` : '/images/default-avatar.png'}
                        alt={person.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-sm text-gray-400">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>
            {/* Similar Movies Section */}
            <section>
              <h2 className="text-2xl font-bold mb-2">Similar Movies</h2>
              <div className="bg-[#2a2a4a] rounded-lg p-6 mb-6">
                <p className="text-lg text-center">
                  Based on your interest in <span className="text-[#ff6347] font-semibold">{movie.title}</span>, we think you'll enjoy these films
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movie.similar.results.slice(0, 8).map(similarMovie => (
                  <Link
                    key={similarMovie.id}
                    href={`/movie/${similarMovie.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={`${IMAGE_BASE}${similarMovie.poster_path}`}
                        alt={similarMovie.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-medium group-hover:text-[#ff6347] transition-colors">
                      {similarMovie.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span>{similarMovie.vote_average.toFixed(1)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
          {/* Right Column - User Rating & Additional Info */}
          <div>
            {/* User Rating Section */}
            <section className="bg-[#2a2a4a] rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Your Rating</h2>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    {rating <= userRating ? (
                      <StarIcon className="w-8 h-8 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon className="w-8 h-8 text-yellow-400" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                {userRating ? `You rated this movie ${userRating} stars` : 'Rate this movie'}
              </p>
            </section>
            {/* Additional Info Section */}
            <section className="bg-[#2a2a4a] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Additional Info</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Director</h3>
                  <p>{director?.name || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Release Date</h3>
                  <p>{new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Runtime</h3>
                  <p>{formatRuntime(movie.runtime)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">TMDB Rating</h3>
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
} 