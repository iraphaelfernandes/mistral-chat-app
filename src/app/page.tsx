'use client';

import { useState } from 'react';
import Chat from '../components/Chat';
import Login from '../components/Login';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  if (!username) {
    return <Login onLogin={setUsername} />;
  }

  return <Chat username={username} />;
}