'use client';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NoteTag } from '@/types/note';

type NoteFormProps = {
  onClose?: () => void;
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      if (onClose) {
        onClose();
      } else {
        router.push('/notes/filter/all');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate(draft);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={draft.title}
        onChange={e => setDraft({ ...draft, title: e.target.value })}
      />
      <textarea
        name="content"
        value={draft.content}
        onChange={e => setDraft({ ...draft, content: e.target.value })}
      />
      <select
        name="tag"
        value={draft.tag}
        onChange={e => setDraft({ ...draft, tag: e.target.value as NoteTag })}
      >
        <option value="Todo">Todo</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Meeting">Meeting</option>
        <option value="Shopping">Shopping</option>
      </select>
      <button type="submit">Save</button>
      <button
        type="button"
        onClick={() => {
          if (onClose) {
            onClose();
          } else {
            router.back();
          }
        }}
      >
        Cancel
      </button>
    </form>
  );
}
