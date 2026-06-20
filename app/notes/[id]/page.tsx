import { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content.slice(0, 100),
    openGraph: {
      title: note.title,
      description: note.content,
      images: [
        {
          url: 'https://notehub-gules.vercel.app/notehub_og_meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub preview',
        },
      ],
    },
  };
}

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
}
