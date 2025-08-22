import Keycloak from 'keycloak-js'

// Create Keycloak instance with proper configuration
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ecosystemlab',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'ecosystemlab-confidential-client',
});

// Keycloak initialization options
export const initOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
  pkceMethod: 'S256' as const,
  // Allow HTTPS in development
  enableLogging: true,
};

export default keycloak