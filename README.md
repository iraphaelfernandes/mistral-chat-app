# Mistral Chat App

A modern chat application built with Next.js that integrates with the Mistral AI API. This app provides a ChatGPT-like interface with chat history management and real-time updates.

## Features

### Chat Interface
- Clean and responsive design with a dark theme
- Real-time message updates
- Loading states and error handling
- Auto-scroll to latest messages
- Mobile-responsive layout

### Chat History Management
- Persistent chat storage using localStorage
- Organized chat history by timeframes:
  - Today
  - Yesterday
  - Previous 7 Days
- Ability to continue previous conversations
- Real-time history updates across tabs

### Navigation
- Sidebar navigation for chat history
- New chat button to start fresh conversations
- Mobile-friendly hamburger menu
- Chat title generation from first message

### AI Integration
- Powered by Mistral AI API
- Natural language processing
- Context-aware responses
- Custom AI avatar for better UX

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Mistral AI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mistral-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Mistral AI API key:
```
NEXT_PUBLIC_MISTRAL_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Mistral AI API

## Environment Variables
- `NEXT_PUBLIC_MISTRAL_API_KEY`: Your Mistral AI API key

## Security
- API keys are stored in environment variables
- Chat history is stored locally in the browser
- No server-side storage of conversations
- Secure API communication

## Usage
1. Start a new chat using the "New Chat" button
2. Type your message and press Enter or click Send
3. View chat history in the sidebar
4. Click on any previous chat to continue the conversation
5. Use the mobile menu button on small screens to access history

## Contributing
Feel free to open issues and pull requests for any improvements.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
