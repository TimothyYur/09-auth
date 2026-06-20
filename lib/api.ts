import axios from 'axios';
import type { Note, FormValues } from '@/types/note';

const API_URL = 'https://notehub-public.goit.study/api/notes';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  page: number,
  perPage: number = 10,
  search?: string,
  tag?: string
): Promise<FetchNotesResponse> {
  const res = await axios.get<FetchNotesResponse>(API_URL, {
    headers,
    params: tag ? { page, perPage, search, tag } : { page, perPage, search },
  });
  return res.data;
}

export async function createNote(values: FormValues): Promise<Note> {
  const res = await axios.post<Note>(API_URL, values, { headers });
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await axios.delete<Note>(`${API_URL}/${id}`, { headers });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await axios.get<Note>(`${API_URL}/${id}`, { headers });
  return res.data;
}
