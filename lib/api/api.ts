import axios from 'axios';

const isServer = typeof window === 'undefined';

const getBaseURL = () => {
  if (isServer) {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!rawUrl || rawUrl.includes('localhost')) {
      return 'http://localhost:3000/api';
    }
    return `${rawUrl.replace(/\/$/, '')}/api`;
  }

  return '/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});
