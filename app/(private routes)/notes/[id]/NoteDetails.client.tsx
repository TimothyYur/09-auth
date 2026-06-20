'use client';
import css from './NoteDetails.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';

export default function NoteDetailsClient({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading note...</p>;
  if (isError) return <p>Failed to load note.</p>;
  if (!data) return <p>No note found.</p>;

  return (
    <article className={css.container}>
      <h2 className={css.header}>{data.title}</h2>
      <p className={css.content}>{data.content}</p>
      <p className={css.content}>Tag: {data.tag}</p>
      <p className={css.content}>Created: {data.createdAt}</p>
    </article>
  );
}
