// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useEffect, useRef } from 'react';
import { AIChatMessage } from "@microsoft/ai-chat-protocol";
import { 
  ChatEntry, 
  AIChatRequestContext, 
  AIChatClientInterface,
  isChatError 
} from '../types';
import { logger } from '../utils';

interface UseWelcomeMessageProps {
  chatClient: AIChatClientInterface | null;
  messages: ChatEntry[];
  sessionState: unknown;
  requestContext?: AIChatRequestContext;
  selectedModel: string;
  onSessionStateChange: (state: unknown) => void;
  onResponseContextChange: (context: any) => void;
  onMessagesUpdate: (messages: ChatEntry[]) => void;
  onLoadingChange: (loading: boolean) => void;
  enabled?: boolean; // Allow disabling welcome message
}

/**
 * Custom hook for handling the automatic welcome message when chat client becomes available
 * Extracted and adapted from the original useWelcomeMessage hook
 */
export function useWelcomeMessage({
  chatClient,
  messages,
  sessionState,
  requestContext,
  selectedModel,
  onSessionStateChange,
  onResponseContextChange,
  onMessagesUpdate,
  onLoadingChange,
  enabled = true
}: UseWelcomeMessageProps) {
  const welcomeMessageSent = useRef(false);

  useEffect(() => {
    if (chatClient && messages.length === 0 && !welcomeMessageSent.current && enabled) {
      logger.log('Sending welcome message...');
      welcomeMessageSent.current = true;

      const sendWelcomeMessage = async () => {
        const welcomeMessage: AIChatMessage = {
          role: "user",
          content: "Hello! Please welcome me and introduce yourself and let me know how you can help me.",
        };

        onLoadingChange(true);

        try {
          const result = await chatClient.getStreamedCompletion([welcomeMessage], {
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
              onMessagesUpdate([{ ...latestMessage }]);  // Only show assistant's response
              onLoadingChange(false);
            }
          }
          onLoadingChange(false);
        } catch (e) {
          onLoadingChange(false);
          logger.error('Welcome message failed:', e);
          
          if (isChatError(e)) {
            onMessagesUpdate([e]);  // Only show error message
          } else {
            // Create a generic error message
            const errorMessage = {
              code: 'WELCOME_MESSAGE_ERROR',
              message: e instanceof Error ? e.message : 'Failed to send welcome message'
            };
            onMessagesUpdate([errorMessage]);  // Only show error message
          }
        }
      };

      sendWelcomeMessage();
    }
  }, [
    chatClient, 
    messages.length, 
    sessionState, 
    requestContext, 
    selectedModel, 
    onSessionStateChange, 
    onResponseContextChange, 
    onMessagesUpdate, 
    onLoadingChange,
    enabled
  ]);
}
