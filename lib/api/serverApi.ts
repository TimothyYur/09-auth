import { api } from './api';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';
import type { AxiosResponse } from 'axios';

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function getMeServer(): Promise<User> {
  const cookieHeader = await getCookieHeader();
  const res = await api.get('/users/me', {
    headers: { Cookie: cookieHeader },
  });
  return res.data;
}

export async function checkSessionServer(): Promise<
  AxiosResponse<{ accessToken: string; refreshToken: string }>
> {
  const cookieHeader = await getCookieHeader();
  const res = await api.get('/auth/session', {
    headers: { Cookie: cookieHeader },
  });
  return res;
}

export async function fetchNotesServer(tag?: string): Promise<{ notes: Note[] }> {
  const cookieHeader = await getCookieHeader();
  const res = await api.get('/notes', {
    headers: { Cookie: cookieHeader },
    params: { tag },
  });
  return res.data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();
  const res = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });
  return res.data;
}
