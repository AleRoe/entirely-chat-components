# Entirely Chat App

A demonstration application built using the `@entirely/react-chat-component`.

This application recreates the functionality of the original Entirely frontend application but uses the new reusable chat component.

## Features

- ✅ **Keycloak Authentication** - Same authentication setup as original
- ✅ **Theme Management** - Light/dark theme with system preference detection
- ✅ **Chat Interface** - Using `EmbeddableChatWidget` component
- ✅ **Model Selection** - Support for multiple AI models
- ✅ **Multiple Tabs** - Chat, Thoughts, and Flow visualization
- ✅ **Request Context** - Configuration pane for request settings
- ✅ **Error Handling** - Comprehensive error boundaries
- ✅ **Responsive Design** - Works on different screen sizes

## Architecture

### Key Components

1. **App.tsx** - Root component with theme and auth providers
2. **AppContent.tsx** - Main authenticated app content using EmbeddableChatWidget
3. **Header.tsx** - User info and logout functionality
4. **ErrorBoundary.tsx** - Error handling wrapper

### Adapters

1. **ChatClientAdapter** - Bridges ExtendedChatClient to ChatClientInterface
2. **AuthProviderAdapter** - Bridges Keycloak to AuthProviderInterface
3. **ExtendedChatClient** - Enhanced chat client with model fetching

### Context

1. **ThemeContext** - Theme management with persistence

## Environment Variables

Create a `.env` file with:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=ecosystemlab
VITE_KEYCLOAK_CLIENT_ID=ecosystemlab-confidential-client
services__kernel_service__http__0=http://localhost:5378
```

## SSL Setup

For HTTPS development (required for Keycloak):

1. Generate SSL certificates named `cert.key` and `cert.crt`
2. Place them in the project root
3. The app will automatically use HTTPS if certificates are present

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Differences from Original

### What's New
- Uses `@entirely/react-chat-component` instead of direct chat implementation
- Adapter pattern for clean integration
- Modular component architecture

### What's the Same
- Exact same authentication flow
- Same backend API endpoints
- Same user experience and functionality
- Same environment configuration

## Integration Points

The app demonstrates how to integrate the chat component with:

1. **External Authentication** (Keycloak)
2. **Custom Chat Clients** (ExtendedChatClient)
3. **Theme Management** (React Context)
4. **Error Handling** (Error Boundaries)
5. **Backend APIs** (Proxy configuration)

This serves as a reference implementation for other applications wanting to use the `@entirely/react-chat-component`.
