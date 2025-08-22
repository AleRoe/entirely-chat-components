// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


import React, { useState, useEffect } from 'react';
import {
  Button,
  Tab,
  TabList,
  TabValue,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  FluentProvider,
  webLightTheme,
  webDarkTheme
} from "@fluentui/react-components";
import { WeatherMoon24Regular, WeatherSunny24Regular, Settings24Regular } from "@fluentui/react-icons";

import styles from "../Chat.module.css";
import { AIChatClientInterface } from '@/types/interfaces';
import { logger } from '@/utils';

interface HeaderAreaProps {
  chatClient: AIChatClientInterface;
  activeTab: TabValue;
  onTabSelect: (tab: TabValue) => void;
  onModelSelect: (model: string) => void;
  onToggleSettings: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  enabledTabs?: string[];

  customClassNames?: {
    container?: string;
    header?: string;
    content?: string;
    modelSelector?: string;
    iconButton?: string;
    requestPane?: string;
  };
}

export const HeaderArea: React.FC<HeaderAreaProps> = ({
  chatClient,
  activeTab,
  onTabSelect,
  onModelSelect,
  onToggleSettings,
  theme = 'light',
  onToggleTheme,
  enabledTabs = ['chat', 'thoughts', 'flow']
}) => {

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");




  // Load available models from the chat client
  useEffect(() => {
    if (chatClient && 'getAvailableModels' in chatClient && typeof chatClient.getAvailableModels === 'function') {
      (chatClient.getAvailableModels as () => Promise<string[]>)()
        .then((models: string[]) => {
          logger.log('Available models loaded:', models);
          setAvailableModels(models);
          // If current selected model is not in the list, use the first one
          if (!models.includes(selectedModel) && models.length > 0) {
            setSelectedModel(models[0]);
          }
        })
        .catch((error) => {
          logger.error('Failed to load available models:', error);
          // Keep default models on error
        })
        .finally(() => {
          //setIsLoadingModels(false);
        });
    }
  }, [chatClient, selectedModel]);


  return (
    <div className={styles.widgetHeader} >
      <TabList selectedValue={activeTab} onTabSelect={(_, data) => onTabSelect(data.value)}>
        {enabledTabs.includes('chat') && <Tab value="chat">Chat</Tab>}
        {enabledTabs.includes('thoughts') && <Tab value="thoughts">Thoughts</Tab>}
        {enabledTabs.includes('flow') && <Tab value="flow">Flow</Tab>}
      </TabList>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Model Selector */}
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              className={styles.modelSelector}
            >
              {selectedModel}
              <span style={{ fontSize: '10px' }}>▼</span>
            </Button>
          </MenuTrigger>
          <FluentProvider theme={theme === 'dark' ? webDarkTheme : webLightTheme}>
          <MenuPopover>
            <MenuList>
              {availableModels.map((model: string) => (
                <MenuItem 
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);  // Update local state
                    onModelSelect(model);     // Update parent state
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    <span style={{
                      fontWeight: model === selectedModel ? '600' : '400'
                    }}>
                      {model}
                    </span>
                    {model === selectedModel && (
                      <span style={{
                        fontSize: '11px',
                        color: '#0078d4'
                      }}>
                        ✓
                      </span>
                    )}
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
          </FluentProvider>
        </Menu>
        {/* Theme Toggle Button */}
        <Button
          appearance="subtle"
          onClick={onToggleTheme}
          icon={theme === 'dark' ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
          className={styles.iconButton}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        />

        {/* Configure Button */}
        <Button
          appearance="subtle"
          onClick={onToggleSettings}
          icon={<Settings24Regular />}
          className={styles.iconButton}
          title="Configure request settings"
        />

      </div>
    </div>
  );
};

