# Chat Component Styling Guide

The `EmbeddableChatWidget` provides multiple ways to customize its appearance to match your application's design.

## 🎨 Styling Options

### 1. **Basic Props**

```typescript
<EmbeddableChatWidget
  credential={credential}
  baseUrl="/api/chat/"
  className="my-custom-chat"
  style={{
    height: '600px',
    width: '100%',
    border: '2px solid #0078d4',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  }}
/>
```

### 2. **Configuration-Based Styling**

```typescript
<EmbeddableChatWidget
  credential={credential}
  baseUrl="/api/chat/"
  config={{
    styling: {
      theme: 'dark', // 'light', 'dark', or 'auto'
      height: '500px',
      width: '100%',
      
      // CSS Variables for deep customization
      cssVariables: {
        'chat-primary-color': '#0078d4',
        'chat-background': '#f5f5f5',
        'chat-text-color': '#333',
        'chat-border-radius': '8px'
      },
      
      // Custom CSS classes for specific elements
      classNames: {
        container: 'my-chat-container',
        header: 'my-chat-header',
        content: 'my-chat-content',
        modelSelector: 'my-model-selector',
        iconButton: 'my-icon-button',
        requestPane: 'my-request-pane'
      },
      
      // Inject custom CSS
      customCss: `
        .my-chat-header {
          background: linear-gradient(90deg, #0078d4, #106ebe);
        }
        .my-model-selector {
          background-color: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
        }
      `
    }
  }}
/>
```

## 🎯 Available CSS Variables

You can override these CSS variables to customize colors and spacing:

```css
:root {
  --chat-primary-color: #0078d4;
  --chat-background: #ffffff;
  --chat-text-color: #333333;
  --chat-border-color: #e1e1e1;
  --chat-border-radius: 8px;
  --chat-header-background: #f8f9fa;
  --chat-input-background: #ffffff;
  --chat-message-user-background: #f5eee5;
  --chat-message-assistant-background: transparent;
  --chat-button-hover-color: rgba(0, 120, 212, 0.1);
}

[data-theme="dark"] {
  --chat-background: #1a1a1a;
  --chat-text-color: #e0e0e0;
  --chat-border-color: #404040;
  --chat-header-background: #2a2a2a;
  --chat-input-background: #2a2a2a;
  --chat-message-user-background: #3a3a3a;
}
```

## 📚 Class Name Targets

### Container Classes
- `.my-chat-container` - Outer container
- `.my-chat-content` - Main chat window
- `.my-chat-header` - Header with tabs and controls

### Header Classes
- `.my-model-selector` - Model selection dropdown
- `.my-icon-button` - Theme toggle and settings buttons

### Content Classes
- `.my-request-pane` - Request context sidebar

## 🎨 Complete Example

```typescript
import { EmbeddableChatWidget } from '@entirely/react-chat-component';

function MyApp() {
  return (
    <EmbeddableChatWidget
      credential={myCredential}
      baseUrl="/api/chat/"
      className="enterprise-chat"
      style={{
        height: '80vh',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
      config={{
        styling: {
          theme: 'auto',
          cssVariables: {
            'chat-primary-color': '#6366f1',
            'chat-border-radius': '12px',
            'chat-header-background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          },
          classNames: {
            header: 'enterprise-header',
            modelSelector: 'enterprise-selector',
            iconButton: 'enterprise-button'
          },
          customCss: `
            .enterprise-header {
              backdrop-filter: blur(10px);
              border-bottom: 2px solid var(--chat-primary-color);
            }
            .enterprise-selector {
              background: rgba(255,255,255,0.1);
              color: white;
              font-weight: 600;
            }
            .enterprise-button {
              background: rgba(255,255,255,0.1);
              color: white;
            }
            .enterprise-button:hover {
              background: rgba(255,255,255,0.2);
            }
          `
        }
      }}
    />
  );
}
```

## 🔧 Advanced Customization

### Using CSS-in-JS Libraries

```typescript
import styled from 'styled-components';

const StyledChatContainer = styled.div`
  .my-chat-header {
    background: ${props => props.theme.primaryGradient};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .my-model-selector {
    background: ${props => props.theme.buttonBackground};
    border: 1px solid ${props => props.theme.borderColor};
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  }
`;

function ThemedChat() {
  return (
    <StyledChatContainer>
      <EmbeddableChatWidget
        credential={credential}
        baseUrl="/api/chat/"
        config={{
          styling: {
            classNames: {
              header: 'my-chat-header',
              modelSelector: 'my-model-selector'
            }
          }
        }}
      />
    </StyledChatContainer>
  );
}
```

### Using CSS Modules

```css
/* ChatWidget.module.css */
.customContainer {
  border: 2px solid #0078d4;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.customHeader {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.customModelSelector {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  font-weight: 600;
}
```

```typescript
import styles from './ChatWidget.module.css';

<EmbeddableChatWidget
  credential={credential}
  baseUrl="/api/chat/"
  config={{
    styling: {
      classNames: {
        container: styles.customContainer,
        header: styles.customHeader,
        modelSelector: styles.customModelSelector
      }
    }
  }}
/>
```

## 📱 Responsive Design

```typescript
<EmbeddableChatWidget
  credential={credential}
  baseUrl="/api/chat/"
  config={{
    styling: {
      customCss: `
        @media (max-width: 768px) {
          .mobile-responsive {
            height: 100vh !important;
            width: 100vw !important;
            border-radius: 0 !important;
          }
        }
      `,
      classNames: {
        container: 'mobile-responsive'
      }
    }
  }}
/>
```

This comprehensive styling system allows you to customize every aspect of the chat component to perfectly match your application's design system!
