// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ChatEntry } from '../types';
import { MessageArea } from './MessageArea';
import { InputArea } from './InputArea';
import styles from '../Chat.module.css';

interface ChatTabProps {
  messages: ChatEntry[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * Main chat interface component
 * Extracted and adapted from the original ChatTab component
 */
export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  input,
  isLoading,
  onInputChange,
  onSendMessage,
  disabled = false,
  //theme = 'light'
}) => {
  /* const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    overflow: 'hidden'
  }; */

  return (
    <div className={styles.chatContainer}>
      <MessageArea 
        messages={messages} 
        isLoading={isLoading}
      />
      <InputArea
        input={input}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
        disabled={disabled}
        
      />
    </div>
  );
};
