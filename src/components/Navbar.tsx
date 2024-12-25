'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
}

export default function Navbar() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadHistory = () => {
      const history = localStorage.getItem('chat_history');
      if (history) {
        setChatHistory(JSON.parse(history));
      }
    };

    loadHistory();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chat_history') {
        loadHistory();
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('chatHistoryUpdate', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chatHistoryUpdate', handleCustomEvent as EventListener);
    };
  }, []);

  const startNewChat = () => {
    if (!mounted) return;
    const chatId = `chat_${Date.now()}`;
    localStorage.setItem('current_chat_id', chatId);
    window.dispatchEvent(new CustomEvent('chatSelect', { detail: { id: chatId, messages: [] } }));
  };

  const selectChat = (chatId: string) => {
    if (!mounted) return;
    localStorage.setItem('current_chat_id', chatId);
    const messages = localStorage.getItem(`chat_messages_${chatId}`);
    window.dispatchEvent(new CustomEvent('chatSelect', { 
      detail: { 
        id: chatId, 
        messages: messages ? JSON.parse(messages) : [] 
      } 
    }));
  };

  const renderChatButton = (chat: ChatHistory) => (
    <button
      key={chat.id}
      className="flex items-center gap-3 rounded-md p-3 text-sm hover:bg-gray-500/10 w-full text-left"
      onClick={() => selectChat(chat.id)}
    >
      <svg 
        stroke="currentColor" 
        fill="none" 
        strokeWidth="2" 
        viewBox="0 0 24 24" 
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
      {chat.title}
    </button>
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <nav className={`fixed top-0 left-0 h-full w-[260px] bg-white dark:bg-[#202123] text-gray-900 dark:text-gray-200 p-2 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col h-full">
          {/* New Chat Button */}
          <div className="flex items-center justify-between mb-2">
            <button 
              className="flex items-center gap-3 rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 flex-1"
              onClick={startNewChat}
            >
              <svg 
                stroke="currentColor" 
                fill="none" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New chat
            </button>
            <ThemeToggle />
          </div>

          {/* History Sections */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {/* Today */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs text-gray-500 dark:text-gray-400 font-medium px-3 py-2">Today</h3>
                {chatHistory
                  .filter(chat => {
                    const date = new Date(chat.timestamp);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                  })
                  .map(renderChatButton)}
              </div>

              {/* Yesterday */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs text-gray-500 dark:text-gray-400 font-medium px-3 py-2">Yesterday</h3>
                {chatHistory
                  .filter(chat => {
                    const date = new Date(chat.timestamp);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return date.toDateString() === yesterday.toDateString();
                  })
                  .map(renderChatButton)}
              </div>

              {/* Previous 7 Days */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs text-gray-500 dark:text-gray-400 font-medium px-3 py-2">Previous 7 Days</h3>
                {chatHistory
                  .filter(chat => {
                    const date = new Date(chat.timestamp);
                    const today = new Date();
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return date < today && date > sevenDaysAgo;
                  })
                  .map(renderChatButton)}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
