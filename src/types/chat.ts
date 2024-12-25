export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatPersonality {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

export const CHAT_PERSONALITIES: ChatPersonality[] = [
  {
    id: 'casual',
    name: 'Casual',
    description: 'Friendly and conversational',
    systemPrompt: 'You are a friendly and casual assistant. Keep your responses light and conversational.',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal and business-like',
    systemPrompt: 'You are a professional assistant. Maintain a formal and business-appropriate tone.',
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Focused on learning and explanation',
    systemPrompt: 'You are an educational assistant. Focus on clear explanations and helping users learn.',
  },
];
