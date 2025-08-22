// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AIChatProtocolClient} from '@microsoft/ai-chat-protocol';
import type { TokenCredential } from '@azure/core-auth';
import { logger } from '../utils/logger';
import type { AIChatClientInterface} from '../types/interfaces';
import { Client } from '@typespec/ts-http-runtime';


function unsafeGet<T = unknown>(o: object, k: PropertyKey): T {
  return (o as any)[k];}

/**
 * Extended chat client that adds additional functionality to the base AIChatProtocolClient
 */
export class AIChatClient extends AIChatProtocolClient implements AIChatClientInterface {
    private baseUrl: string;
   
    constructor(baseUrl: string, credential: TokenCredential) {
        super(baseUrl, credential);
        this.baseUrl = baseUrl;

  }

    /**
 * Get available models from the chat API
 * @returns Promise<string[]> List of available model names
 */
async getAvailableModels(): Promise<string[]> {
    try {
      logger.log('Fetching available models...');
      const client = unsafeGet<Client>(this, 'client');
      const response = await client.path(`${this.baseUrl}/models`).get();
    
      if (!/2\d\d/.test(response.status)) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
      }
  
      const models: string[] = response.body;
      logger.log('Available models fetched:', models);
      return models;
      
    } catch (error) {
      logger.error('Error fetching available models:', error);
      throw error;
    }
  }

}
