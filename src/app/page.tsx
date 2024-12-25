'use client';

import { useEffect, useState } from 'react';
import { Chat, Navbar, Login } from '@/components/ClientComponents';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
    setMounted(true);
  }, []);

  const handleLogin = (newUsername: string) => {
    localStorage.setItem('chat_username', newUsername);
    setUsername(newUsername);
  };

  if (!mounted) {
    return null;
  }

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen">
      <Navbar />
      <main className="flex-1 md:pl-[260px]">
        <Chat username={username} />
      </main>
    </div>
  );
}