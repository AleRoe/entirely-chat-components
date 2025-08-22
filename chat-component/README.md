# @entirely/react-chat-component

A modern, embeddable React chat component with AI capabilities, built with TypeScript and FluentUI.

## Features

- 🤖 **AI-powered chat** with streaming responses
- 🎨 **Modern UI** with FluentUI components
- 🌙 **Dark/Light theme** support
- 📱 **Responsive design** with draggable panels
- 🔧 **Highly customizable** with extensive configuration options
- 📊 **Built-in tabs** for chat, thoughts, and flow visualization
- ⚡ **TypeScript** with full type safety
- 🎯 **Request context** management with overrides

## Installation

```bash
npm install @entirely/react-chat-component
```

### Peer Dependencies
```bash
npm install react react-dom @fluentui/react-components @fluentui/react-icons
```

## Quick Start

```tsx
import { EcosystemChatWidget } from '@entirely/react-chat-component';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <EcosystemChatWidget
        baseUrl="https://your-ai-endpoint.com"
        credential={yourCredential}
        config={{
          features: {
            modelSelector: true,
            themeToggle: true,
            contextPane: true
          },
          styling: {
            height: '600px',
            theme: 'auto'
          }
        }}
      />
    </FluentProvider>
  );
}
```

## Configuration

### Props Interface

```tsx
interface EcosystemChatWidgetProps {
  // Authentication (choose one)
  chatClient?: AIChatClientInterface;
  baseUrl?: string;
  credential?: TokenCredential;
  
  // Configuration
  config?: ChatComponentConfig;
  eventHandlers?: ChatEventHandlers;
  initialModel?: string;
}
```

### Configuration Options

```tsx
interface ChatComponentConfig {
  features?: {
    modelSelector?: boolean;
    themeToggle?: boolean;
    tabs?: ('chat' | 'thoughts' | 'flow')[];
    contextPane?: boolean;
    welcomeMessage?: boolean;
  };
  styling?: {
    theme?: 'light' | 'dark' | 'auto';
    height?: string;
    width?: string;
  };
  defaults?: {
    model?: string;
    availableModels?: string[];
  };
}
```

## Event Handlers

```tsx
const eventHandlers = {
  onMessage: (message) => console.log('Message sent:', message),
  onError: (error) => console.error('Chat error:', error),
  onModelChange: (model) => console.log('Model changed:', model),
  onThemeChange: (theme) => console.log('Theme changed:', theme),
  onTabChange: (tab) => console.log('Tab changed:', tab),
};
```

## Styling

The component uses FluentUI themes and CSS modules. You can customize the appearance by:

1. **Theme Provider**: Wrap in FluentProvider with your theme
2. **CSS Custom Properties**: Override CSS variables
3. **Custom Classes**: Use the className props

## Advanced Usage

### Custom Chat Client

```tsx
import { AIChatClient } from '@entirely/react-chat-component';

const customClient = new AIChatClient(baseUrl, credential);

<EcosystemChatWidget chatClient={customClient} />
```

### Request Context & Overrides

The component supports request context with custom overrides:

```tsx
// Users can add custom parameters via the context pane
// These get passed to your AI endpoint
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT © Entirely Team

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
