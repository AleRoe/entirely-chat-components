// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Type definitions for the Entirely React Chat Component
 */

// Chat-specific types (export first to avoid conflicts)
export * from './chat';

// Core interfaces for component integration
export * from './interfaces';

// Re-export commonly used types from ai-chat-protocol
export type { AIChatMessage, AIChatError } from "@microsoft/ai-chat-protocol";
