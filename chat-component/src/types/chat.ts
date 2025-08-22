// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AIChatMessage, AIChatError } from "@microsoft/ai-chat-protocol";
import { TabValue } from "@fluentui/react-components";

// Re-export key types for convenience
export type { AIChatMessage, AIChatError } from "@microsoft/ai-chat-protocol";

// Core chat types (extracted from original codebase)
export type AIChatThought = {
  title: string;
  description?: string[];
  props?: object;
}

export interface IAIChatFlowVisualization {
  description: string;
  visualization: object;
}

export type AIChatResponseContext = {
  followup_questions?: string[];
  thoughts?: AIChatThought[];
  flow_visualization?: IAIChatFlowVisualization;
}

export type AIChatRequestContext = {
  overrides?: Record<string, string | object>;
  additional_instructions?: string;
}

export type ChatEntry = (AIChatMessage & { dataUrl?: string }) | AIChatError;

export type ChatTabType = "chat" | "thoughts" | "flow";

/**
 * Internal chat state for the component
 */
export interface ChatState {
  messages: ChatEntry[];
  input: string;
  isLoading: boolean;
  activeTab: TabValue;
  sessionState: unknown;
  requestContext?: AIChatRequestContext;
  responseContext?: AIChatResponseContext;
  selectedModel: string;
  availableModels: string[];
  isLoadingModels: boolean;
  isRequestContextPaneOpen: boolean;
}

/**
 * Actions for managing chat state
 */
export interface ChatActions {
  setMessages: (messages: ChatEntry[]) => void;
  setInput: (input: string) => void;
  setIsLoading: (loading: boolean) => void;
  setActiveTab: (tab: TabValue) => void;
  setSessionState: (state: unknown) => void;
  setRequestContext: (context?: AIChatRequestContext) => void;
  setResponseContext: (context?: AIChatResponseContext) => void;
  setSelectedModel: (model: string) => void;
  setAvailableModels: (models: string[]) => void;
  setIsLoadingModels: (loading: boolean) => void;
  setIsRequestContextPaneOpen: (open: boolean) => void;
  sendMessage: () => Promise<void>;
}

// Utility type guards
export function isChatError(entry: unknown): entry is AIChatError {
  return (entry as AIChatError).code !== undefined;
}

// Constants
export const AVAILABLE_MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1-preview", "o1-mini"];

// Theme type
export type Theme = 'light' | 'dark';

/**
 * Hook return type for chat state management
 */
export interface UseChatStateReturn {
  state: ChatState;
  actions: ChatActions;
}
