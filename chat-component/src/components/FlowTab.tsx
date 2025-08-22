// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useRef, useEffect, useState } from 'react';
import mermaid from "mermaid";
import { AIChatResponseContext } from '../types/chat';
import { addBackgroundsToMessageText } from '../utils';
import styles from "../Chat.module.css";

interface FlowTabProps {
  responseContext?: AIChatResponseContext;
  theme: string;
}

interface FlowErrorProps {
  error: string;
  responseContext?: AIChatResponseContext;
  theme: string;
}

interface NoFlowProps {
  responseContext?: AIChatResponseContext;
  theme: string;
}

const FlowError: React.FC<FlowErrorProps> = ({ error, responseContext, theme }) => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center', 
    color: theme === 'dark' ? '#b0b0b0' : '#666' 
  }}>
    Error rendering diagram: {error}<br/><br/>
    <div style={{ 
      background: theme === 'dark' ? '#1a1a1a' : '#f5f5f5', 
      padding: '10px', 
      borderRadius: '5px', 
      fontFamily: 'monospace', 
      fontSize: '12px', 
      textAlign: 'left', 
      color: theme === 'dark' ? '#e0e0e0' : '#000' 
    }}>
      <strong>Raw diagram data:</strong><br/>
      <pre>{JSON.stringify(responseContext?.flow_visualization?.visualization) || 'No diagram data'}</pre>
    </div>
  </div>
);

const NoFlowDisplay: React.FC<NoFlowProps> = ({ responseContext, theme }) => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center', 
    color: theme === 'dark' ? '#b0b0b0' : '#666' 
  }}>
    No process flow diagram available to display.<br/><br/>
    <div style={{ 
      background: theme === 'dark' ? '#1a1a1a' : '#f5f5f5', 
      padding: '10px', 
      borderRadius: '5px', 
      fontFamily: 'monospace', 
      fontSize: '12px', 
      textAlign: 'left', 
      color: theme === 'dark' ? '#e0e0e0' : '#000' 
    }}>
      <strong>Debug - Context:</strong><br/>
      <pre>{JSON.stringify(responseContext, null, 2)}</pre>
    </div>
  </div>
);

export const FlowTab: React.FC<FlowTabProps> = ({ responseContext, theme }) => {
  const flowRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
      setError(null);
      setIsLoading(true);
      setSvgContent(''); // Clear previous content

      // Initialize Mermaid with theme based on current app theme
      mermaid.initialize({ 
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default'
      });
      
      if (responseContext?.flow_visualization?.visualization) {
        try {
          const { svg } = await mermaid.render(
            `flow-diagram-${Date.now()}`, // Unique ID to avoid conflicts
            responseContext.flow_visualization.visualization.toString()
          );
          
          setSvgContent(svg);
          setIsLoading(false);
        } catch (renderError: any) {
          setError(renderError.message);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [responseContext, theme]);

  // Apply post-processing after SVG is rendered
  useEffect(() => {
    if (svgContent && flowRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        if (flowRef.current) {
          addBackgroundsToMessageText(flowRef.current, theme);
        }
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [svgContent, theme]);

  const hasFlowData = responseContext?.flow_visualization?.visualization;

  return (
    <div className={styles.flowContainer} style={{ padding: 24 }}>
      {isLoading && (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: theme === 'dark' ? '#b0b0b0' : '#666' 
        }}>
          Rendering diagram...
        </div>
      )}
      
      {!isLoading && error && (
        <FlowError 
          error={error} 
          responseContext={responseContext} 
          theme={theme} 
        />
      )}
      
      {!isLoading && !error && !hasFlowData && (
        <NoFlowDisplay 
          responseContext={responseContext} 
          theme={theme} 
        />
      )}
      
      {!isLoading && !error && hasFlowData && svgContent && (
        <div 
          ref={flowRef}
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};
