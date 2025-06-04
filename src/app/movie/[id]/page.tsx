import { Metadata } from 'next';
import MovieDetailsClient from './MovieDetailsClient';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Movie Details`,
  };
}

export default async function MoviePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <MovieDetailsClient id={resolvedParams.id} />;
} 