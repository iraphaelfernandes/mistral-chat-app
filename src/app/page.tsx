'use client';

import { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import Login from '../components/Login';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  if (!username) {
    return <Login onLogin={setUsername} />;
  }

  return <Chat username={username} />;
}