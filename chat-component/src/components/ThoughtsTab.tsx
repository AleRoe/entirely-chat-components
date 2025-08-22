// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { AIChatResponseContext, AIChatThought } from '../types/chat';
import styles from "../Chat.module.css";

interface ThoughtsTabProps {
  responseContext?: AIChatResponseContext;
}

interface ThoughtCardProps {
  thought: AIChatThought;
}

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought }) => {
  const formatProps = (props: object) => {
    try {
      // If props is already a string that looks like JSON, parse it first
      if (typeof props === 'string') {
        return JSON.stringify(JSON.parse(props), null, 2).replaceAll("\\n", " ");
      }
      // Otherwise, just stringify the object
      return JSON.stringify(props, null, 2);
    } catch (e) {
      // If parsing fails, return the original as a string
      return JSON.stringify(props, null, 2);
    }
  };

  return (
    <div className={styles.thoughtCard}>
      <div className={styles.thoughtTitle}>{thought.title}</div>
      
      {thought.description && (
        <div className={styles.thoughtDescription}>
          {Array.isArray(thought.description) 
            ? thought.description.map((desc, index) => (
                <React.Fragment key={index}>
                  {desc}
                  {index < thought.description!.length - 1 && <br />}
                </React.Fragment>
              ))
            : thought.description
          }
        </div>
      )}
      
      {thought.props && (
        <details className={styles.thoughtDetails}>
          <summary className={styles.thoughtDetailsSummary}>View Details</summary>
          <div className={styles.thoughtDetailsContent}>
            <pre className={styles.thoughtDetailsPre}>
              {formatProps(thought.props)}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
};

const NoThoughtsDisplay: React.FC<{ responseContext?: AIChatResponseContext }> = ({ responseContext }) => (
  <div className={styles.noThoughtsContainer}>
    <div className={styles.noThoughtsTitle}>No thoughts available</div>
    <div className={styles.noThoughtsSubtitle}>The AI hasn't generated any thoughts yet.</div>
    <div className={styles.debugContainer}>
      <strong>Debug - Context:</strong><br/>
      <pre className={styles.debugPre}>
        {JSON.stringify(responseContext, null, 2)}
      </pre>
    </div>
  </div>
);

export const ThoughtsTab: React.FC<ThoughtsTabProps> = ({ responseContext }) => {
  const hasThoughts = responseContext?.thoughts && responseContext.thoughts.length > 0;

  return (
    <div style={{ 
      padding: 24, 
      overflow: 'auto', 
      width: '100%', 
      boxSizing: 'border-box', 
      minWidth: 0, 
      height: '100%' 
    }}>
      {hasThoughts ? (
        <div className={styles.thoughtsContainer}>
          <h3 className={styles.thoughtsTitle}>AI Thoughts</h3>
          {responseContext.thoughts!.map((thought, index) => (
            <ThoughtCard key={index} thought={thought} />
          ))}
        </div>
      ) : (
        <NoThoughtsDisplay responseContext={responseContext} />
      )}
    </div>
  );
};
