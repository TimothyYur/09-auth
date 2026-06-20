import { create } from 'zustand';

type Draft = {
  title: string;
  content: string;
  tag: string;
};

type DraftState = {
  draft: Draft;
  setDraft: (draft: Draft) => void;
  clearDraft: () => void;
};

export const useDraftStore = create<DraftState>(set => ({
  draft: { title: '', content: '', tag: '' },
  setDraft: draft => set({ draft }),
  clearDraft: () => set({ draft: { title: '', content: '', tag: '' } }),
}));
