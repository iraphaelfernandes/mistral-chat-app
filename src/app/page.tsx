'use client';

import { Chat, Navbar } from '@/components/ClientComponents';

export default function Home() {
  return (
    <div className="fixed inset-0 bg-[#1a1a1a]">
      <Navbar />
      <Chat />
    </div>
  );
}