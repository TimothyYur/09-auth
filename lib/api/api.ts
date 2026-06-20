import axios from 'axios';

const isServer = typeof window === 'undefined';

export const api = axios.create({
  baseURL: isServer
    ? process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : 'http://localhost:3000/api'
    : '/api',
  withCredentials: true,
});
