// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component, ReactNode } from 'react';
import { Button, Card, CardHeader, Text, Title3 } from '@fluentui/react-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          padding: '20px'
        }}>
          <Card style={{ 
            maxWidth: '500px', 
            width: '100%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            borderRadius: '12px'
          }}>
            <CardHeader>
              <Title3 style={{ textAlign: 'center', margin: 0, color: '#dc2626' }}>
                Something went wrong
              </Title3>
            </CardHeader>
            <div style={{ padding: '16px' }}>
              <Text style={{ 
                textAlign: 'center', 
                marginBottom: '16px',
                color: '#666',
                lineHeight: '1.5'
              }}>
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </Text>
              
              {this.state.error && (
                <details style={{ 
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  border: '1px solid #e1e1e1'
                }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
                    Error Details
                  </summary>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {this.state.error.message}
                    {this.state.error.stack && '\n\n' + this.state.error.stack}
                  </pre>
                </details>
              )}
              
              <Button 
                appearance="primary" 
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Refresh Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
