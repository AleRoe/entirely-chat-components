// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Button } from "@fluentui/react-components";
import TextareaAutosize from "react-textarea-autosize";
import { AIChatRequestContext } from '../types/chat';

interface RequestContextPaneProps {
  isOpen: boolean;
  theme: string;
  requestContext?: AIChatRequestContext;
  onRequestContextChange: (context?: AIChatRequestContext) => void;
  onClose: () => void;
  className?: string;
}

interface OverrideItemProps {
  keyName: string;
  value: string | object;
  theme: string;
  onKeyChange: (oldKey: string, newKey: string) => void;
  onValueChange: (key: string, value: string | object) => void;
  onRemove: (key: string) => void;
}

const OverrideItem: React.FC<OverrideItemProps> = ({
  keyName,
  value,
  theme,
  onKeyChange,
  onValueChange,
  onRemove
}) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let parsedValue = e.target.value;
    try {
      // Try to parse as JSON if it looks like JSON
      if (e.target.value.startsWith('{') || e.target.value.startsWith('[') || 
          e.target.value === 'true' || e.target.value === 'false' || 
          !isNaN(Number(e.target.value))) {
        parsedValue = JSON.parse(e.target.value);
      }
    } catch {
      // Keep as string if parsing fails
    }
    onValueChange(keyName, parsedValue);
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '6px', 
      marginBottom: '8px',
      alignItems: 'flex-start',
      width: '100%',
      minWidth: 0 // Allow flex children to shrink
    }}>
      <input
        type="text"
        value={keyName}
        onChange={(e) => onKeyChange(keyName, e.target.value)}
        placeholder="Key"
        style={{
          flex: '1 1 0',
          minWidth: 0, // Allow input to shrink
          border: `1px solid ${theme === 'dark' ? '#404040' : '#d1d5db'}`,
          borderRadius: '4px',
          padding: '6px 8px',
          fontSize: '12px',
          background: theme === 'dark' ? '#1a1a1a' : '#fff',
          color: theme === 'dark' ? '#e0e0e0' : '#000',
          transition: 'border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease',
          boxSizing: 'border-box'
        }}
      />
      <input
        type="text"
        value={typeof value === 'string' ? value : JSON.stringify(value)}
        onChange={handleValueChange}
        placeholder="Value"
        style={{
          flex: '1 1 0',
          minWidth: 0, // Allow input to shrink
          border: `1px solid ${theme === 'dark' ? '#404040' : '#d1d5db'}`,
          borderRadius: '4px',
          padding: '6px 8px',
          fontSize: '12px',
          background: theme === 'dark' ? '#1a1a1a' : '#fff',
          color: theme === 'dark' ? '#e0e0e0' : '#000',
          transition: 'border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease',
          boxSizing: 'border-box'
        }}
      />
      <Button
        appearance="subtle"
        onClick={() => onRemove(keyName)}
        style={{
          minWidth: '28px',
          width: '28px',
          height: '28px',
          padding: '2px',
          fontSize: '12px',
          flexShrink: 0 // Don't shrink the button
        }}
      >
        ✕
      </Button>
    </div>
  );
};

export const RequestContextPane: React.FC<RequestContextPaneProps> = ({
  isOpen,
  theme,
  requestContext,
  onRequestContextChange,
  onClose,
  className
}) => {
  if (!isOpen) return null;

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (!requestContext?.overrides) return;
    
    const newOverrides = { ...requestContext.overrides };
    const value = newOverrides[oldKey];
    delete newOverrides[oldKey];
    newOverrides[newKey] = value;
    
    onRequestContextChange({
      ...requestContext,
      overrides: newOverrides
    });
  };

  const handleValueChange = (key: string, value: string | object) => {
    onRequestContextChange({
      ...requestContext,
      overrides: {
        ...requestContext?.overrides,
        [key]: value
      }
    });
  };

  const handleRemoveOverride = (key: string) => {
    if (!requestContext?.overrides) return;
    
    const newOverrides = { ...requestContext.overrides };
    delete newOverrides[key];
    
    onRequestContextChange({
      ...requestContext,
      overrides: Object.keys(newOverrides).length > 0 ? newOverrides : undefined
    });
  };

  const handleAddOverride = () => {
    const newKey = `key${Object.keys(requestContext?.overrides || {}).length + 1}`;
    onRequestContextChange({
      ...requestContext,
      overrides: {
        ...requestContext?.overrides,
        [newKey]: ''
      }
    });
  };

  const handleClear = () => {
    onRequestContextChange(undefined);
  };

  return (
    <div 
      className={className}
      style={{
        width: '100%',  /* Changed from 300px to 100% since parent controls width */
        height: '100%', /* Fill the parent container height */
        borderLeft: `1px solid ${theme === 'dark' ? '#404040' : '#ececec'}`,
        background: theme === 'dark' ? '#1e1e1e' : '#fff',
        padding: '20px',
        overflowY: 'auto',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        boxSizing: 'border-box'  /* Include padding in width calculation */
      }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '16px', 
          fontWeight: '600', 
          color: theme === 'dark' ? '#e0e0e0' : '#000' 
        }}>
          Request Context
        </h3>
        <Button
          appearance="subtle"
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px' }}
        >
          ✕
        </Button>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '500', 
          fontSize: '14px', 
          color: theme === 'dark' ? '#e0e0e0' : '#000' 
        }}>
          Additional Instructions:
        </label>
        <TextareaAutosize
          value={requestContext?.additional_instructions || ''}
          onChange={(e) => onRequestContextChange({
            ...requestContext,
            additional_instructions: e.target.value
          })}
          placeholder="Enter additional instructions..."
          minRows={3}
          maxRows={6}
          style={{
            width: '100%',
            border: `1px solid ${theme === 'dark' ? '#404040' : '#d1d5db'}`,
            borderRadius: '4px',
            padding: '12px',
            fontSize: '14px',
            resize: 'vertical',
            background: theme === 'dark' ? '#2a2a2a' : '#fff',
            color: theme === 'dark' ? '#e0e0e0' : '#000',
            transition: 'border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            lineHeight: '1.4'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '500', 
          fontSize: '14px', 
          color: theme === 'dark' ? '#e0e0e0' : '#000' 
        }}>
          Overrides:
        </label>
        <div style={{ 
          border: `1px solid ${theme === 'dark' ? '#404040' : '#d1d5db'}`, 
          borderRadius: '4px', 
          padding: '12px',
          maxHeight: '200px',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: theme === 'dark' ? '#2a2a2a' : '#fff',
          transition: 'border-color 0.3s ease, background-color 0.3s ease',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          {requestContext?.overrides ? (
            Object.entries(requestContext.overrides).map(([key, value], index) => (
              <OverrideItem
                key={`${key}-${index}`}
                keyName={key}
                value={value}
                theme={theme}
                onKeyChange={handleKeyChange}
                onValueChange={handleValueChange}
                onRemove={handleRemoveOverride}
              />
            ))
          ) : (
            <div style={{ 
              color: theme === 'dark' ? '#b0b0b0' : '#6c757d', 
              fontSize: '12px', 
              fontStyle: 'italic' 
            }}>
              No overrides defined
            </div>
          )}
          <Button
            appearance="subtle"
            onClick={handleAddOverride}
            style={{
              width: '100%',
              marginTop: '8px',
              fontSize: '12px',
              boxSizing: 'border-box'
            }}
          >
            + Add Override
          </Button>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <Button
          appearance="primary"
          onClick={handleClear}
          style={{ 
            flex: '1 1 auto',
            minWidth: '60px',
            boxSizing: 'border-box'
          }}
        >
          Clear
        </Button>
        <Button
          appearance="subtle"
          onClick={onClose}
          style={{ 
            flex: '1 1 auto',
            minWidth: '60px',
            boxSizing: 'border-box'
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};
