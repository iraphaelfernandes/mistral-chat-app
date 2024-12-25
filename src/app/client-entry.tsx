'use client';

import { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import Login from '../components/Login';

export default function ClientEntry() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]" />
    );
  }

  const handleLogin = (newUsername: string) => {
    localStorage.setItem('chat_username', newUsername);
    setUsername(newUsername);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}
