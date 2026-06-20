import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export async function fetchNotes(
  page: number,
  perPage: number = 10,
  search?: string,
  tag?: string
): Promise<{ notes: Note[]; totalPages: number }> {
  const res = await api.get('/notes', {
    params: { page, perPage, search, tag },
  });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(
  values: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> {
  const res = await api.post('/notes', values);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get('/users/me');
  return res.data;
}

export async function checkSession(): Promise<unknown> {
  const res = await api.get('/auth/session');
  return res.data;
}

export type UpdateUserPayload = {
  username?: string;
  avatar?: string;
};

export async function updateMe(values: UpdateUserPayload): Promise<User> {
  const res = await api.patch('/users/me', values);
  return res.data;
}

export async function register(values: { email: string; password: string }): Promise<User> {
  const res = await api.post('/auth/register', values);
  return res.data;
}

export async function login(values: { email: string; password: string }): Promise<User> {
  const res = await api.post('/auth/login', values);
  return res.data;
}

export async function logout(): Promise<{ message: string }> {
  const res = await api.post('/auth/logout');
  return res.data;
}
