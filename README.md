# Entirely Chat Components

A monorepo containing React chat components and applications for AI-powered conversations.

## 📦 Packages

### [`chat-component`](./chat-component)
A reusable React chat component library with AI capabilities.

- 🤖 **AI-powered chat** with streaming responses
- 🎨 **Modern UI** with FluentUI components  
- 🌙 **Dark/Light theme** support
- 📱 **Responsive design** with draggable panels
- 🔧 **Highly customizable** configuration
- 📊 **Built-in tabs** for chat, thoughts, and flow visualization
- ⚡ **TypeScript** with full type safety

**NPM Package**: `@aleroe/react-chat-component`

### [`chat-app`](./chat-app)
A demo application showcasing the chat component in action.

- 🚀 **Live demo** of the chat component
- 🛠️ **Development environment** for testing
- 📱 **Example integrations** and configurations
- 🎯 **Testing playground** for new features

## 🚀 Quick Start

### Install the Component
```bash
npm install @aleroe/react-chat-component
```

### Use in Your Project
```tsx
import { EcosystemChatWidget } from '@aleroe/react-chat-component';
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

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/AleRoe/entirely-chat-components.git
cd entirely-chat-components

# Install dependencies for all packages
npm install

# Build the component library
cd chat-component
npm run build

# Run the demo app
cd ../chat-app
npm run dev
```

### Project Structure
```
entirely-chat-components/
├── chat-component/          # React component library
│   ├── src/                 # Source code
│   ├── dist/                # Built package
│   └── package.json         # NPM package config
├── chat-app/                # Demo application
│   ├── src/                 # Demo app source
│   └── package.json         # App dependencies
└── README.md                # This file
```

## 📚 Documentation

- [Component Documentation](./chat-component/README.md)
- [API Reference](./chat-component/README.md#configuration)
- [Demo App Guide](./chat-app/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [GitHub Packages](https://github.com/AleRoe/entirely-chat-components/packages)
- [GitHub Repository](https://github.com/AleRoe/entirely-chat-components)
- [Issues](https://github.com/AleRoe/entirely-chat-components/issues)
- [Discussions](https://github.com/AleRoe/entirely-chat-components/discussions)

## ⭐ Support

If you find this project helpful, please give it a star ⭐ on GitHub!
