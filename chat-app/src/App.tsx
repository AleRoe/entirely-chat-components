// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { initOptions } from './keycloak';
import AppContent from './components/AppContent';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { logger } from './utils';

// Inner component that uses the theme context
function AppWithTheme() {
  const { theme } = useTheme();
  const eventLogger = (event: any, error?: any) => {
    logger.log('Keycloak event:', event);
    if (error) {
      logger.error('Keycloak event error:', event, error);
    }
  };
  const LoadingComponent = (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ fontSize: '18px' }}>Initializing...</div>
      <div style={{ fontSize: '14px', color: '#666' }}>Setting up authentication</div>
    </div>
  );
  
  return (
    <ReactKeycloakProvider 
      authClient={keycloak}
      initOptions={initOptions}
      LoadingComponent={LoadingComponent}
      onEvent={eventLogger}
    >
      <FluentProvider theme={theme === 'dark' ? webDarkTheme : webLightTheme}>
        <AppContent />
      </FluentProvider>
    </ReactKeycloakProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppWithTheme />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
