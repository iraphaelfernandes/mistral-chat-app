import { Message } from '../types/chat';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function generateChatCompletion(
  messages: Message[],
  apiKey: string,
  systemPrompt?: string
) {
  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: systemPrompt 
          ? [{ role: 'system', content: systemPrompt }, ...messages]
          : messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
}
