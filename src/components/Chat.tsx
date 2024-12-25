'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  username: string;
}

export default function Chat({ username }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedChatId = localStorage.getItem('current_chat_id');
    if (storedChatId) {
      setChatId(storedChatId);
      const storedMessages = localStorage.getItem(`chat_messages_${storedChatId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } else {
      const newChatId = `chat_${Date.now()}`;
      setChatId(newChatId);
      localStorage.setItem('current_chat_id', newChatId);
    }

    const handleChatSelect = (e: CustomEvent) => {
      const { id, messages: selectedMessages } = e.detail;
      setChatId(id);
      setMessages(selectedMessages);
    };

    window.addEventListener('chatSelect', handleChatSelect as EventListener);

    return () => {
      window.removeEventListener('chatSelect', handleChatSelect as EventListener);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateChatHistory = () => {
    const history = localStorage.getItem('chat_history') || '[]';
    const chatHistory = JSON.parse(history);
    
    const existingChatIndex = chatHistory.findIndex((chat: any) => chat.id === chatId);
    const chatTitle = messages[0]?.content.slice(0, 30) + '...' || 'New Chat';
    
    if (existingChatIndex !== -1) {
      chatHistory[existingChatIndex].title = chatTitle;
      chatHistory[existingChatIndex].timestamp = new Date().toISOString();
    } else {
      chatHistory.unshift({
        id: chatId,
        title: chatTitle,
        timestamp: new Date().toISOString()
      });
    }
    
    localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(messages));
    
    window.dispatchEvent(new CustomEvent('chatHistoryUpdate'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.choices[0].message.content
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}. Please check your API key and try again.`
          : 'Sorry, there was an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      updateChatHistory();
    }
  }, [messages, chatId]);

  return (
    <div className="fixed inset-0 md:pl-[260px] flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-4 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            } ${message.role === 'assistant' ? 'bg-gray-100 dark:bg-gray-700' : ''} p-4 rounded-lg`}
          >
            {message.role === 'assistant' ? (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                  <path d="M8.5 14C8.22386 14 8 13.7761 8 13.5C8 13.2239 8.22386 13 8.5 13C8.77614 13 9 13.2239 9 13.5C9 13.7761 8.77614 14 8.5 14Z" fill="white" stroke="white" />
                  <path d="M15.5 14C15.2239 14 15 13.7761 15 13.5C15 13.2239 15.2239 13 15.5 13C15.7761 13 16 13.2239 16 13.5C16 13.7761 15.7761 14 15.5 14Z" fill="white" stroke="white" />
                  <path d="M12 16C11.2044 16 10.4413 15.6839 9.87868 15.1213C9.31607 14.5587 9 13.7956 9 13" stroke="white" strokeLinecap="round" />
                  <path d="M18 9V11C18 12.1046 18.8954 13 20 13H21" stroke="white" strokeLinecap="round" />
                  <path d="M6 9V11C6 12.1046 5.10457 13 4 13H3" stroke="white" strokeLinecap="round" />
                  <path d="M18 15V16C18 17.1046 18.8954 18 20 18H21" stroke="white" strokeLinecap="round" />
                  <path d="M6 15V16C6 17.1046 5.10457 18 4 18H3" stroke="white" strokeLinecap="round" />
                  <path d="M19 2L17.5 3.5" stroke="white" strokeLinecap="round" />
                  <path d="M5 2L6.5 3.5" stroke="white" strokeLinecap="round" />
                  <path d="M12 2V4" stroke="white" strokeLinecap="round" />
                  <path d="M3 21H21" stroke="white" strokeLinecap="round" />
                  <path d="M19 6V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6Z" stroke="white" />
                </svg>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-medium">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
              <p className={`whitespace-pre-wrap inline-block ${
                message.role === 'user' ? 'bg-purple-600 text-white' : 'text-gray-900 dark:text-white'
              } p-2 rounded-lg`}>
                {message.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
