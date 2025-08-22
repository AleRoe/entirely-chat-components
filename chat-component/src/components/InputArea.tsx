

import React, { useId } from 'react';
import TextareaAutosize from "react-textarea-autosize";
import styles from "../Chat.module.css";

interface InputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  input,
  onInputChange,
  onSendMessage,
  disabled = false
}) => {
  //const { theme } = useTheme();
  const inputId = useId();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

 
  return (
    <div className={styles.inputArea}>
      <TextareaAutosize
        id={inputId}
        className={styles.inputTextarea}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        minRows={1}
        maxRows={6}
        placeholder="Type your message and press Enter..."
        disabled={disabled}
      />
    </div>
  );
};
