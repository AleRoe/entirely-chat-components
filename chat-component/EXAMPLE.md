# @entirely/react-chat-component Usage Example

## Installation

```bash
npm install @entirely/react-chat-component
```

## Basic Usage

```jsx
import React from 'react';
import { EcosystemChatWidget } from '@entirely/react-chat-component';

// Example chat client implementation
const mockChatClient = {
  async *getStreamedCompletion(messages, options) {
    // Simulate streaming response
    const response = "Hello! I'm your AI assistant. How can I help you today?";
    
    for (let i = 0; i < response.length; i++) {
      yield {
        delta: {
          role: 'assistant',
          content: response[i]
        }
      };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
};

function App() {
  return (
    <div style={{ width: '400px', height: '500px', margin: '20px' }}>
      <EcosystemChatWidget
        chatClient={mockChatClient}
        config={{
          features: {
            modelSelector: true,
            themeToggle: true,
            tabs: ['chat'],
            contextPane: false,
            welcomeMessage: true
          },
          styling: {
            theme: 'light',
            height: '100%',
            width: '100%'
          }
        }}
        eventHandlers={{
          onMessage: (message) => console.log('New message:', message),
          onError: (error) => console.error('Chat error:', error)
        }}
      />
    </div>
  );
}

export default App;
```

## Available Components

- `EcosystemChatWidget` - Main chat component
- `ChatTab` - Chat interface component  
- `MessageList` - Message display component
- `InputArea` - Chat input component
- `ThoughtsTab` - AI thoughts display
- `FlowTab` - Flow visualization component

## Available Hooks

- `useChatState` - Chat state management
- `useStreamingChat` - Streaming chat functionality
- `useWelcomeMessage` - Welcome message handling

## TypeScript Support

Full TypeScript definitions are included. Key interfaces:

- `ChatClientInterface` - For implementing chat backends
- `AuthProviderInterface` - For authentication systems
- `EmbeddableChatWidgetProps` - Main component props
- `ChatComponentConfig` - Configuration options
