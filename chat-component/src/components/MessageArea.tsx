// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Spinner } from "@fluentui/react-components";
import { ChatEntry, isChatError } from '../types/chat';
import { AIChatError } from "@microsoft/ai-chat-protocol";
import styles from "../Chat.module.css";

interface MessageAreaProps {
  messages: ChatEntry[];
  isLoading: boolean;
}

const getClassName = (message: ChatEntry) => {
  if (isChatError(message)) {
    return styles.caution;
  }
  return message.role === "user"
    ? styles.userMessage
    : styles.assistantMessage;
};

const getErrorMessage = (message: AIChatError) => {
  return `${message.code}: ${message.message}`;
};

export const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.messageArea}>
      {messages.map((message, idx) => (
        <div key={idx} className={getClassName(message)}>
          {isChatError(message) ? (
            <>{getErrorMessage(message)}</>
          ) : (
            message.role === "assistant" ? (
              <div className={styles.assistantResponse}>
                <div className={styles.responseResultContent}>
                  <ReactMarkdown 
                    remarkPlugins={[gfm]}
                    components={{
                      a: ({node, ...props}) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className={styles.userPrompt}>
                <div className={styles.responseResultContent}>
                  <ReactMarkdown remarkPlugins={[gfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            )
          )}
        </div>
      ))}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spinner label="Waiting for response..." size="large" />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
