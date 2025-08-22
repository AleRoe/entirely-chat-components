// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AIChatMessage, AIChatError, AIChatCompletionDelta, AIChatCompletionOperationOptions, AIChatCompletion } from "@microsoft/ai-chat-protocol";
import { ChatEntry, ChatTabType } from './chat';

/**
 * Core abstractions for the embeddable chat component
 */

// Authentication is now handled by the ChatClientInterface
// AuthProviderInterface removed - authentication is managed by the chat client

/**
 * Chat client interface for different AI backends
 */
export interface AIChatClientInterface {
  /** Send messages and get streaming response */
  getStreamedCompletion(
    messages: AIChatMessage[], 
    options?: AIChatCompletionOperationOptions
  ): Promise<AsyncIterable<AIChatCompletionDelta>>;
  
  getCompletion(
    messages: AIChatMessage[], 
    options?: AIChatCompletionOperationOptions
  ): Promise<AIChatCompletion>;

  /** Get available models (optional) */
  getAvailableModels?(): Promise<string[]>;
}

/**
 * Configuration for chat component features
 */
export interface ChatComponentConfig {
  features: {
    modelSelector: boolean;
    themeToggle: boolean;
    tabs: ChatTabType[];
    contextPane: boolean;
    welcomeMessage: boolean;
  };
  styling: {
    theme?: ThemeType;
    height?: string | number;
    width?: string | number;
    customCss?: string;
    cssVariables?: Record<string, string>;
    classNames?: {
      container?: string;
      header?: string;
      content?: string;
      modelSelector?: string;
      iconButton?: string;
      requestPane?: string;
    };
  };
  defaults: {
    model?: string;
    availableModels?: string[];
  };
}

/**
 * Theme configuration
 */
export type ThemeType = 'light' | 'dark' | 'auto';

// ChatTabType is exported from './chat' to avoid duplication

/**
 * Event handlers for the chat component
 */
export interface ChatEventHandlers {
  onMessage?: (message: AIChatMessage) => void;
  onError?: (error: Error | AIChatError) => void;
  onThemeChange?: (theme: ThemeType) => void;
  onModelChange?: (model: string) => void;
  onTabChange?: (tab: ChatTabType) => void;
}

/**
 * Main props for the embeddable chat widget
 */
export interface EcosystemChatWidgetClientProps {
  /** Chat client implementation (required) */
  chatClient: AIChatClientInterface;
  
  /** Component configuration */
  config?: Partial<ChatComponentConfig>;
  
  /** Event handlers */
  eventHandlers?: ChatEventHandlers;
  
  /** Custom styling */
  className?: string;
  style?: React.CSSProperties;
  
  /** Initial state */
  initialMessages?: ChatEntry[];
  initialModel?: string;
}

/**
 * Alternative props for the embeddable chat widget using TokenCredential
 */
export interface EcosystemChatWidgetCredentialProps {
  /** Token credential for authentication */
  credential: import('@azure/core-auth').TokenCredential;
  
  /** Base URL for the chat service */
  baseUrl: string;
  
  /** Component configuration */
  config?: Partial<ChatComponentConfig>;
  
  /** Event handlers */
  eventHandlers?: ChatEventHandlers;
  
  /** Custom styling */
  className?: string;
  style?: React.CSSProperties;
  
  /** Initial state */
  initialMessages?: ChatEntry[];
  initialModel?: string;
}

/**
 * Union type for either props interface
 */
export type EcosystemChatWidgetProps = EcosystemChatWidgetClientProps | EcosystemChatWidgetCredentialProps;

// Import and re-export types from chat.ts to avoid duplication
export type { 
  AIChatThought, 
  IAIChatFlowVisualization, 
  AIChatResponseContext, 
  AIChatRequestContext, 
  ChatEntry 
} from './chat';
