'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
                <Image
                  src="/robot.svg"
                  alt="AI"
                  width={20}
                  height={20}
                />
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
