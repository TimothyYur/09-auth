import { fetchNotesServer } from '@/lib/api/serverApi';
import type { Metadata } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import NotesClient from './Notes.client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug?.[0] ?? 'all';

  return {
    title: `Notes filtered by ${currentTag} | NoteHub`,
    description: `Browse notes filtered by ${currentTag} tag in NoteHub.`,
    openGraph: {
      title: `Notes filtered by ${currentTag} | NoteHub`,
      description: `Browse notes filtered by ${currentTag} tag in NoteHub.`,
      url: `https://notehub.com/notes/filter/${currentTag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub filter preview',
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const currentTag = slug?.[0] === 'all' ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', currentTag],
    queryFn: () => fetchNotesServer(currentTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}
