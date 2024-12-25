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
    return <div className="fixed inset-0 bg-[#1a1a1a]" />;
  }

  if (!username) {
    return (
      <div className="fixed inset-0 bg-[#1a1a1a]">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1a1a1a]">
      <Navbar />
      <Chat username={username} />
    </div>
  );
}