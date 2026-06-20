'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';
import css from './NotesPage.module.css';

export default function NotesClient({ tag }: { tag?: string }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search, tag],
    queryFn: () => fetchNotes(page, 10, search, tag),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Error loading notes</p>;

  const notes = data?.notes ?? [];

  return (
    <div>
      <SearchBox value={search} onSearch={debouncedSearch} />
      <Link href="/notes/action/create">
        <button className={css.button}>Create note +</button>
      </Link>

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={selected => setPage(selected)}
        />
      )}
      {notes.length > 0 ? <NoteList notes={notes} /> : <p>No notes found</p>}
    </div>
  );
}
