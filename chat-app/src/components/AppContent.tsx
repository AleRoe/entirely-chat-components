// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Spinner, Button, Card, CardHeader, Text, Title3 } from '@fluentui/react-components';
import { EcosystemChatWidget } from '@entirely/react-chat-component';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';
import { KeycloakTokenCredential } from '../auth/KeycloakCredential';

const AppContent: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();
  const { theme, toggleTheme } = useTheme();
  const [credential, setCredential] = useState<KeycloakTokenCredential | null>(null);
  
  
  // Debug logging
  console.log('AppContent render:', { 
    initialized, 
    authenticated: keycloak?.authenticated,
    token: keycloak?.token ? 'present' : 'missing',
    keycloakReady: keycloak?.didInitialize
  });

  // Initialize credential when authenticated
  useEffect(() => {
    if (keycloak?.authenticated && keycloak.token) {
      try {
        console.log('Creating Keycloak credential...');
        
        const keycloakCredential = new KeycloakTokenCredential(keycloak);
        setCredential(keycloakCredential);
        
        console.log('Keycloak credential created successfully');
      } catch (error) {
        console.error('Failed to create Keycloak credential:', error);
        setCredential(null);
      }
    } else {
      setCredential(null);
    }
  }, [keycloak?.authenticated, keycloak?.token]);

  // Show loading spinner while initializing
  if (!initialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Spinner label="Initializing authentication..." size="large" />
        <div style={{ fontSize: '14px', color: '#666' }}>
          Please wait while we set up authentication...
        </div>
      </div>
    );
  }

  // Check for initialization errors
  if (initialized && !keycloak?.didInitialize) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '18px', color: '#d63031' }}>
          Authentication Setup Failed
        </div>
        <div style={{ fontSize: '14px', color: '#666', textAlign: 'center', maxWidth: '400px' }}>
          There was an issue connecting to the authentication server. 
          This might be a configuration issue or the server might be unavailable.
        </div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!keycloak.authenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <Card style={{ 
          maxWidth: '400px', 
          width: '100%',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}>
          <CardHeader>
            <Title3 style={{ textAlign: 'center', margin: 0 }}>
              Welcome to Entirely Chat App
            </Title3>
          </CardHeader>
          <div style={{ padding: '16px' }}>
            <Text style={{ 
              textAlign: 'center', 
              marginBottom: '24px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              Please sign in to access the chat functionality. 
              This application uses secure authentication through Keycloak.
            </Text>
            
            <Button 
              appearance="primary" 
              onClick={() => keycloak.login()}
              style={{
                width: '100%',
                height: '48px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Sign In
            </Button>
            
            <div style={{ 
              marginTop: '16px', 
              textAlign: 'center',
              fontSize: '12px',
              color: '#999'
            }}>
              You will be redirected to the secure login page
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show authenticated app with chat component
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden', // Changed from 'hidden' to 'auto' to allow scrolling if needed
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
    }}>
      <Header />
      
      <div style={{ 
        flex: 1, 
        minHeight: 0,
        overflow: 'hidden', // Changed from 'hidden' to 'auto' for proper scrolling
        padding: '0'
      }}>
        {credential ? (
          <EcosystemChatWidget
            credential={credential}
            baseUrl="/api/chat/"
            config={{
              features: {
                modelSelector: true,
                themeToggle: true,
                tabs: ['chat', 'thoughts', 'flow'],
                contextPane: true,
                welcomeMessage: true
              },
              styling: {
                theme: theme,
                height: '100%',
                width: '100%'
              },
              defaults: {
                model: 'gpt-4o',
                availableModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1-preview', 'o1-mini']
              }
            }}
            eventHandlers={{
              onMessage: (message) => console.log('New message:', message),
              onError: (error) => console.error('Chat error:', error),
              onThemeChange: (newTheme) => {
                console.log('Theme changed to:', newTheme);
                toggleTheme(); // Use the actual theme toggle function
              },
              onModelChange: (model) => console.log('Model changed to:', model),
              onTabChange: (tab) => console.log('Tab changed to:', tab)
            }}
            style={{
              height: '100%',
              width: '100%',
              border: 'none',
              borderRadius: '0'
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Spinner label="Initializing chat..." size="large" />
            <Text>Setting up authentication...</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppContent;
