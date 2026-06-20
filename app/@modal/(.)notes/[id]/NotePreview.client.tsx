'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { Note } from '@/types/note';
import Modal from '@/components/Modal/Modal';
import { useRouter } from 'next/navigation';

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading note</p>;
  if (!data) return <p>Note not found</p>;

  return (
    <Modal onClose={handleClose}>
      <div className="note-preview">
        <h2>{data.title}</h2>
        <p>{data.content}</p>
        <div className="note-meta">
          <span>Tag: {data.tag}</span>
          <span>Created: {new Date(data.createdAt).toLocaleString()}</span>
        </div>
        <button onClick={handleClose}>Close</button>
      </div>
    </Modal>
  );
}
