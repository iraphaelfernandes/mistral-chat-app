import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
    if (!apiKey) {
      console.error('API key is missing. Available env vars:', Object.keys(process.env));
      throw new Error('NEXT_PUBLIC_MISTRAL_API_KEY is not set');
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Mistral API error:', data);
      return NextResponse.json(
        { error: `Mistral API error: ${data.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
