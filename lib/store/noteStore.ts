import { NoteTag } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Draft = {
  title: string;
  content: string;
  tag: NoteTag;
};

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

type NoteStore = {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
};

type DraftState = {
  draft: Draft;
  setDraft: (draft: Draft) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set(state => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
);

export const useDraftStore = create<DraftState>(set => ({
  draft: { title: '', content: '', tag: 'Work' },
  setDraft: draft => set({ draft }),
  clearDraft: () => set({ draft: { title: '', content: '', tag: 'Work' } }),
}));
