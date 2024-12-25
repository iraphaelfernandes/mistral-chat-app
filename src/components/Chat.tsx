'use client';

import { useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface ChatProps {
  username: string;
}

export default function Chat({ username }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generate a unique chat ID for this session
    const chatId = `chat_${Date.now()}`;
    localStorage.setItem('current_chat_id', chatId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setError(null);

    try {
      setIsLoading(true);

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mistral-tiny',
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content }))
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: Date.now()
      };

      const updatedMessages = [...messages, userMessage, aiMessage];
      setMessages(updatedMessages);

      // Save chat history
      const chatId = localStorage.getItem('current_chat_id') || `chat_${Date.now()}`;
      const chatHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');
      
      // Update or create chat entry
      const chatEntry = {
        id: chatId,
        title: updatedMessages[0]?.content.slice(0, 30) + (updatedMessages[0]?.content.length > 30 ? '...' : '') || 'New Chat',
        timestamp: new Date().toISOString(),
      };

      const existingChatIndex = chatHistory.findIndex((chat: any) => chat.id === chatId);
      if (existingChatIndex === -1) {
        chatHistory.unshift(chatEntry);
      } else {
        chatHistory[existingChatIndex] = chatEntry;
      }

      localStorage.setItem('chat_history', JSON.stringify(chatHistory));
      localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(updatedMessages));

      // Dispatch custom event to update navbar
      window.dispatchEvent(new CustomEvent('chatHistoryUpdate'));

    } catch (error) {
      console.error('Error details:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while communicating with the AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
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
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-purple-600'
                  : 'bg-gray-700'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center p-2 bg-red-100/10 rounded">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={1}
            style={{ maxHeight: '200px' }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
