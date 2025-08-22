// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useState, useCallback } from 'react';
import { TabValue } from "@fluentui/react-components";
import { 
  ChatState, 
  ChatActions, 
  UseChatStateReturn,
  ChatEntry,
  AIChatRequestContext,
  AIChatResponseContext,
  AVAILABLE_MODELS
} from '../types';

/**
 * Hook for managing chat component state
 */
export function useChatState(initialState?: Partial<ChatState>): UseChatStateReturn {
  const [state, setState] = useState<ChatState>({
    messages: [],
    input: '',
    isLoading: false,
    activeTab: 'chat',
    sessionState: undefined,
    requestContext: undefined,
    responseContext: undefined,
    selectedModel: 'gpt-4o',
    availableModels: AVAILABLE_MODELS,
    isLoadingModels: false,
    isRequestContextPaneOpen: false,
    ...initialState
  });

  const setMessages = useCallback((messages: ChatEntry[]) => {
    setState(prev => ({ ...prev, messages }));
  }, []);

  const setInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, input }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setActiveTab = useCallback((activeTab: TabValue) => {
    setState(prev => ({ ...prev, activeTab }));
  }, []);

  const setSessionState = useCallback((sessionState: unknown) => {
    setState(prev => ({ ...prev, sessionState }));
  }, []);

  const setRequestContext = useCallback((requestContext?: AIChatRequestContext) => {
    setState(prev => ({ ...prev, requestContext }));
  }, []);

  const setResponseContext = useCallback((responseContext?: AIChatResponseContext) => {
    setState(prev => ({ ...prev, responseContext }));
  }, []);

  const setSelectedModel = useCallback((selectedModel: string) => {
    setState(prev => ({ ...prev, selectedModel }));
  }, []);

  const setAvailableModels = useCallback((availableModels: string[]) => {
    setState(prev => ({ ...prev, availableModels }));
  }, []);

  const setIsLoadingModels = useCallback((isLoadingModels: boolean) => {
    setState(prev => ({ ...prev, isLoadingModels }));
  }, []);

  const setIsRequestContextPaneOpen = useCallback((isRequestContextPaneOpen: boolean) => {
    setState(prev => ({ ...prev, isRequestContextPaneOpen }));
  }, []);

  // Placeholder for sendMessage - will be implemented in useStreamingChat
  const sendMessage = useCallback(async () => {
    console.warn('sendMessage not implemented in useChatState hook - use useStreamingChat');
  }, []);

  const actions: ChatActions = {
    setMessages,
    setInput,
    setIsLoading,
    setActiveTab,
    setSessionState,
    setRequestContext,
    setResponseContext,
    setSelectedModel,
    setAvailableModels,
    setIsLoadingModels,
    setIsRequestContextPaneOpen,
    sendMessage
  };

  return { state, actions };
}
