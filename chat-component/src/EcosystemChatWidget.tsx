// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo, useState } from 'react';
import { TabValue } from '@fluentui/react-components';
import {
  ChatComponentConfig,
  ThemeType,
  AIChatClientInterface,
  EcosystemChatWidgetProps,
  EcosystemChatWidgetCredentialProps,
} from './types/interfaces';

import { HeaderArea } from './components/HeaderArea';
import { ContentArea } from './components/ContentArea';
import { AIChatClient } from '@/clients';
import styles from "./Chat.module.css";
/**
 * Type guard to check if props contain credential
 */
function hasCredential(props: EcosystemChatWidgetProps): props is EcosystemChatWidgetCredentialProps {
  return 'credential' in props && 'baseUrl' in props;
}

/**
 * Main embeddable chat widget component
 * This is the primary export that consumers will use
 * 
 * Supports two usage patterns:
 * 1. Pass a chatClient instance directly
 * 2. Pass a credential and baseUrl to create an internal chatClient
 */
export const EcosystemChatWidget: React.FC<EcosystemChatWidgetProps> = (props) => {
  // Create or use the provided chat client
  const chatClient: AIChatClientInterface = useMemo(() => {
    if (hasCredential(props)) {
      // Create internal AIChatClient using credential
      return new AIChatClient(props.baseUrl, props.credential);
    } else {
      // Use provided chatClient
      return props.chatClient;
    }
  }, [props]);

  // Extract common props
  const {
    config = {},
    eventHandlers = {},
    //className,
    // style,  // Unused for now
    //initialMessages = [],
    initialModel = 'gpt-4o'
  } = props;

  // Merge with default configuration
  const finalConfig: ChatComponentConfig = useMemo(() => ({
    features: {
      modelSelector: true,
      themeToggle: true,
      tabs: ['chat', 'thoughts', 'flow'],
      contextPane: true,
      welcomeMessage: true,
      ...config.features
    },
    styling: {
      theme: 'auto',
      height: '500px',
      width: '100%',
      ...config.styling
    },
    defaults: {
      model: initialModel,
      availableModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
      ...config.defaults
    }
  }), [config, initialModel]);

  // Determine theme
  const theme: ThemeType = finalConfig.styling.theme || 'light';
  const resolvedTheme = theme === 'auto'
    ? (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  // Component state (similar to original Chat.tsx)
  const [activeTab, setActiveTab] = useState<TabValue>("chat" as TabValue);
  const [isRequestContextPaneOpen, setIsRequestContextPaneOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(finalConfig.defaults.model || "gpt-4o");
 
  
  // Handle theme toggle if enabled
  const handleToggleTheme = () => {
    // Call the parent's theme change handler if provided
    if (eventHandlers.onThemeChange) {
      const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      eventHandlers.onThemeChange(newTheme);
    } else {
      console.log('Theme toggle requested but no onThemeChange handler provided');
    }
  };

  // Handle model selection
  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    eventHandlers.onModelChange?.(model);
  };

  // Handle tab selection
  const handleTabSelect = (tab: TabValue) => {
    setActiveTab(tab);
    eventHandlers.onTabChange?.(tab as any);
  };

  /* // Container styles
  const containerStyle: React.CSSProperties = {
    width: finalConfig.styling.width,
    height: finalConfig.styling.height,
    ...style
  };

  // Apply CSS variables if provided
  const cssVariablesStyle: React.CSSProperties = finalConfig.styling.cssVariables ? {
    ...Object.fromEntries(
      Object.entries(finalConfig.styling.cssVariables).map(([key, value]) => [`--${key}`, value])
    )
  } : {};

  // Combine container classes
  const containerClasses = [
    className,
    finalConfig.styling.classNames?.container
  ].filter(Boolean).join(' '); */
  
  // Get theme from parent FluentProvider
  

  
  return (
    <div className={styles.widgetWindow}>
      <HeaderArea 
        chatClient={chatClient} 
        activeTab={activeTab} 
        onTabSelect={handleTabSelect}  
        onModelSelect={handleModelSelect} 
        theme={resolvedTheme}
        onToggleTheme={handleToggleTheme} 
        onToggleSettings={() => setIsRequestContextPaneOpen(!isRequestContextPaneOpen)} 
        enabledTabs={finalConfig.features.tabs} 
      />
      <ContentArea 
        chatClient={chatClient} 
        activeTab={activeTab} 
        selectedModel={selectedModel} 
        eventHandlers={eventHandlers} 
        theme={resolvedTheme} 
        isRequestContextPaneOpen={isRequestContextPaneOpen}
        onCloseRequestContextPane={() => setIsRequestContextPaneOpen(false)}
      />
    </div>
  );
};

export default EcosystemChatWidget;
