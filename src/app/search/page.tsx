'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { API_KEY, IMAGE_BASE } from '@/config/api';
import { StarIcon } from '@heroicons/react/24/solid';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch search results');

        setMovies(data.results);
        setTotalResults(data.total_results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while searching');
        console.error('Error searching movies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Search Query</h2>
          <p className="text-gray-400 mb-6">Please enter a search term to find movies</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[2/3] bg-gray-800 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                </div>
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

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-400">
            Found {totalResults} results for "{query}"
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
            <p className="text-gray-400 mb-6">Try different keywords or check your spelling</p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-[#ff6347] text-white rounded-lg hover:bg-[#ff6347]/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden">
                  <Image
                    src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : '/images/no-poster.png'}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium group-hover:text-[#ff6347] transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                  {movie.overview}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[2/3] bg-gray-800 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
} 