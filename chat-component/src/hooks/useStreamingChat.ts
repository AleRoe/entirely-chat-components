// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useCallback } from 'react';
import { AIChatMessage } from "@microsoft/ai-chat-protocol";
import { 
  ChatEntry, 
  AIChatClientInterface, 
  AIChatRequestContext, 
  isChatError 
} from '../types';
import { logger } from '../utils';

interface UseStreamingChatOptions {
  chatClient: AIChatClientInterface;
  messages: ChatEntry[];
  sessionState: unknown;
  requestContext?: AIChatRequestContext;
  selectedModel: string;
  onSessionStateChange: (state: unknown) => void;
  onResponseContextChange: (context: any) => void;
  onMessagesUpdate: (messages: ChatEntry[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

/**
 * Hook for handling streaming chat functionality
 * Extracted from the original Chat.tsx sendMessage function
 */
export function useStreamingChat({
  chatClient,
  messages,
  sessionState,
  requestContext,
  selectedModel,
  onSessionStateChange,
  onResponseContextChange,
  onMessagesUpdate,
  onLoadingChange
}: UseStreamingChatOptions) {

  const sendMessage = useCallback(async (input: string) => {
    logger.log('sendMessage called:', { 
      inputLength: input.length, 
      inputTrimmed: input.trim(), 
      chatClient: !!chatClient,
      clientType: chatClient?.constructor?.name
    });
    
    if (!input.trim()) {
      logger.warn('sendMessage aborted: input is empty');
      return;
    }
    
    if (!chatClient) {
      logger.error('sendMessage aborted: chatClient is null/undefined');
      return;
    }

    const message: AIChatMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages: ChatEntry[] = [
      ...messages,
      message,
    ];

    onMessagesUpdate(updatedMessages);
    onLoadingChange(true);

    try {
      const validMessages = messages.filter(msg => !isChatError(msg)) as AIChatMessage[];
      const result = await chatClient.getStreamedCompletion([...validMessages, message], {
        sessionState: sessionState,
        context: {
          ...requestContext,
          overrides: {
            ...requestContext?.overrides,
            model: selectedModel
          }
        }
      });

      const latestMessage: AIChatMessage = { content: "", role: "assistant", context: undefined };

      for await (const response of result) {
        if (response.sessionState) {
          onSessionStateChange(response.sessionState);
        }
        if (!response.delta) {
          continue;
        }
        if (response.delta.role) {
          latestMessage.role = response.delta.role;
        }
        if (response.context) {
          onResponseContextChange(response.context);
        }
        if (response.delta.content) {
          latestMessage.content += response.delta.content;
          onMessagesUpdate([...updatedMessages, { ...latestMessage }]);
          onLoadingChange(false);
        }
      }
      onLoadingChange(false);
    } catch (e) {
      onLoadingChange(false);
      if (isChatError(e)) {
        onMessagesUpdate([...updatedMessages, e]);
      } else {
        logger.error('Chat error:', e);
        // Create a generic error message
        const errorMessage = {
          code: 'UNKNOWN_ERROR',
          message: e instanceof Error ? e.message : 'An unknown error occurred'
        };
        onMessagesUpdate([...updatedMessages, errorMessage]);
      }
    }
  }, [
    chatClient,
    messages,
    sessionState,
    requestContext,
    selectedModel,
    onSessionStateChange,
    onResponseContextChange,
    onMessagesUpdate,
    onLoadingChange
  ]);

  return { sendMessage };
}
