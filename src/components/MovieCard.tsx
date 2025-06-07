'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push(`/movie/${movie?.id}`);
  };

  const imageUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/images/placeholder-poster.svg';

  return (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800" onClick={handleClick}>
      <Image
        src={imageUrl}
        alt={movie?.title || 'Movie Poster'}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-medium line-clamp-2">{movie?.title || 'Unknown Title'}</h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm">{movie?.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 