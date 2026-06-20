'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ color: 'red', padding: '1rem' }}>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  );
}
