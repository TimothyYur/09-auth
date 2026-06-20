import { fetchNoteByIdServer } from '@/lib/api/serverApi';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Note ${id} | NoteHub`,
    description: `Details of note ${id}`,
  };
}

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
