'use client';

import dynamic from 'next/dynamic';

export const Chat = dynamic(() => import('./Chat'), {
  ssr: false,
});

export const Navbar = dynamic(() => import('./Navbar'), {
  ssr: false,
});
