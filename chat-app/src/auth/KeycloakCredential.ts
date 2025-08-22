import Keycloak from "keycloak-js";
import type { TokenCredential, AccessToken, GetTokenOptions } from "@azure/core-auth";

export class KeycloakTokenCredential implements TokenCredential {
  constructor(private readonly keycloak: Keycloak, private readonly minValiditySeconds = 60) {}

  async getToken(
    _scopes: string | string[],            // Ignored: Keycloak issues the token; scopes are handled via realm/client config.
    _options?: GetTokenOptions
  ): Promise<AccessToken | null> {
    // Make sure we have a fresh token (refresh if it expires within minValiditySeconds)
    try {
      await this.keycloak.updateToken(this.minValiditySeconds);
    } catch (_e) {
      // If refresh fails, don't automatically trigger login here as it would disrupt API calls
      // Instead, return null and let the calling code handle the authentication error
      console.warn('Token refresh failed:', _e);
      return null;
    }

    const token = this.keycloak.token;
    const exp = this.keycloak.tokenParsed?.exp; // seconds since epoch

    if (!token || !exp) {
      console.warn('Token or expiry not available');
      return null;
    }

    return { token, expiresOnTimestamp: exp * 1000 };
  }
}
