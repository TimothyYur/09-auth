'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes, FetchNotesResponse } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import { keepPreviousData } from '@tanstack/react-query';
import Link from 'next/link';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch, tag],
    queryFn: () =>
      tag === 'all'
        ? fetchNotes(page, 10, debouncedSearch)
        : fetchNotes(page, 10, debouncedSearch, tag),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];

  return (
    <div>
      <SearchBox
        onSearch={value => {
          setSearch(value);
          setPage(1);
        }}
      />

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={selected => setPage(selected)}
        />
      )}

      <Link href="/notes/action/create">
        <button>Create note +</button>
      </Link>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
      {notes.length > 0 ? <NoteList notes={notes} /> : <p>No notes found</p>}
    </div>
  );
}
