import React, { useState } from 'react';
import { TabValue } from '@fluentui/react-components';
import { ChatTab } from './ChatTab';
import { FlowTab } from './FlowTab';
import { RequestContextPane } from './RequestContextPane';
import { ThoughtsTab } from './ThoughtsTab';
import { AIChatMessage, AIChatRequestContext, AIChatResponseContext, ChatEntry, isChatError } from '@/types/chat';
import { logger } from '@/utils';
import { AIChatClientInterface, ChatEventHandlers } from '@/types/interfaces';
import { useWelcomeMessage } from '@/hooks';
import styles from '../Chat.module.css';

interface ContentAreaProps {
  chatClient: AIChatClientInterface;
  activeTab: TabValue;
  selectedModel: string;
  eventHandlers: ChatEventHandlers;
  theme: string;
  isRequestContextPaneOpen: boolean;
  onCloseRequestContextPane: () => void;
}


/**
 * Component for chat input with send button
 * Extracted and adapted from the original InputArea component
 */
export const ContentArea: React.FC<ContentAreaProps> = ({
  chatClient,
  activeTab,
  selectedModel,
  eventHandlers,
  theme = 'light',
  isRequestContextPaneOpen,
  onCloseRequestContextPane
}) => {


  const [requestContext, setRequestContext] = useState<AIChatRequestContext>();
  const [responseContext, setResponseContext] = useState<AIChatResponseContext>();
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Default width
  const [isResizing, setIsResizing] = useState(false);

  const [sessionState, setSessionState] = useState<unknown>(undefined);

  // Handle sidebar resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const containerElement = document.querySelector(`.${styles.contentContainer}`) as HTMLElement;
    if (!containerElement) return;
    
    const containerRect = containerElement.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    const minWidth = 250; // Minimum sidebar width
    const maxWidth = Math.min(600, containerRect.width * 0.6); // Maximum 60% of container width
    
    setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
  }, [isResizing, styles.contentContainer]);

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add global mouse event listeners for resizing
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Handle welcome message automatically
  useWelcomeMessage({
    chatClient,
    messages,
    sessionState,
    requestContext,
    selectedModel,
    onSessionStateChange: setSessionState,
    onResponseContextChange: setResponseContext,
    onMessagesUpdate: setMessages,
    onLoadingChange: setIsLoading,
    enabled: true
  });

  // Streaming message sending (copied from original)
  const sendMessage = async () => {
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
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Trigger event handler
    eventHandlers.onMessage?.(message);

    try {
      const validMessages = messages.filter(msg => !isChatError(msg)) as AIChatMessage[];
      const result = await chatClient.getStreamedCompletion([...validMessages, message], {
        sessionState: sessionState,
        context: {
          ...requestContext,
          overrides: {
            ...requestContext?.overrides,
            modelId: selectedModel
          }
        }
      });
      const latestMessage: AIChatMessage = { content: "", role: "assistant", context: undefined };
      for await (const response of result) {
        if (response.sessionState) {
          setSessionState(response.sessionState);
        }
        if (!response.delta) {
          continue;
        }
        if (response.delta.role) {
          latestMessage.role = response.delta.role;
        }
        if (response.context) {
          setResponseContext(response.context);
        }
        if (response.delta.content) {
          latestMessage.content += response.delta.content;
          setMessages([...updatedMessages, { ...latestMessage }]);
          setIsLoading(false);
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (isChatError(e)) {
        setMessages([...updatedMessages, e as ChatEntry]);
        eventHandlers.onError?.(e as unknown as Error);
      }
    }
  };

  return (
    <div className={styles.widgetContent}>
      <div className={`${styles.contentContainer} ${isRequestContextPaneOpen ? styles.withSidebar : ''}`}>
        {/* Main content area */}
        <div className={styles.mainContent}>
          {activeTab === "chat" && (
            <ChatTab
              messages={messages}
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSendMessage={sendMessage}
              disabled={!chatClient}
            />
          )}
          {activeTab === "thoughts" && (
            <ThoughtsTab responseContext={responseContext} />
          )}
          {activeTab === "flow" && (
            <FlowTab responseContext={responseContext} theme={theme} />
          )}
        </div>

        {/* Sidebar for RequestContextPane */}
        {isRequestContextPaneOpen && (
          <div 
            className={styles.sidebar}
            style={{ width: sidebarWidth }}
          >
            {/* Drag handle */}
            <div 
              className={styles.dragHandle}
              onMouseDown={handleMouseDown}
              style={{ cursor: isResizing ? 'col-resize' : 'col-resize' }}
            />
            <RequestContextPane
              isOpen={isRequestContextPaneOpen}
              theme={theme}
              requestContext={requestContext}
              onRequestContextChange={setRequestContext}
              onClose={onCloseRequestContextPane}
              className={styles.requestContextPane}
            />
          </div>
        )}
      </div>
    </div>
  );
};
