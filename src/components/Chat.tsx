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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a placeholder response.'
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a]">
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
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
            />
            <button
              type="submit"
              className="bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
