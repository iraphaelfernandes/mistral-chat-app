'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending chat request...');
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-tiny',
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage.content
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from Mistral AI');
      }

      const data = await response.json();
      console.log('Received response:', data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error details:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while communicating with the AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a]">
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                  <span className="text-white text-sm">AI</span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'bg-[#2a2a2a] text-gray-200'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ml-2">
                  <span className="text-white text-sm">U</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                <span className="text-white text-sm">AI</span>
              </div>
              <div className="bg-[#2a2a2a] rounded-2xl px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 bg-[#1a1a1a] p-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 rounded-full bg-[#2a2a2a] border-none text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 rotate-90"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
