import type { Metadata } from 'next';
import css from './page.module.css';

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFoundPage() {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
