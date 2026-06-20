'use client';
import type { NoteTag } from '@/types/note';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { useDraftStore } from '@/lib/store/noteStore';
import type { Note } from '@/types/note';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useDraftStore();

  const createMutation = useMutation({
    mutationFn: (values: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate({
      title: draft.title,
      content: draft.content,
      tag: draft.tag,
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        className={css.input}
        type="text"
        name="title"
        value={draft.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDraft({ ...draft, title: e.target.value })
        }
        required
      />
      <textarea
        className={css.textarea}
        name="content"
        value={draft.content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDraft({ ...draft, content: e.target.value })
        }
        required
      />
      <select
        className={css.select}
        name="tag"
        value={draft.tag}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setDraft({ ...draft, tag: e.target.value as NoteTag })
        }
      >
        <option className={css.actions} value="Work">
          Work
        </option>
        <option className={css.actions} value="Todo">
          Todo
        </option>
        <option className={css.actions} value="Personal">
          Personal
        </option>
        <option className={css.actions} value="Meeting">
          Meeting
        </option>
        <option className={css.actions} value="Shopping">
          Shopping
        </option>
      </select>
      <button className={css.submitButton} type="submit">
        Save
      </button>
      <button className={css.cancelButton} type="button" onClick={() => router.back()}>
        Cancel
      </button>
    </form>
  );
}
