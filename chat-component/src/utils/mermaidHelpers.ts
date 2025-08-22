// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import logger from './logger';

/**
 * Adds background rectangles behind message text in SVG elements
 * This is specifically used for Mermaid diagrams to ensure text readability
 * against the app's background color in both light and dark themes
 *
 * @param container - The HTML element containing the SVG
 * @param theme - The current theme ('light' or 'dark')
 */
export function addBackgroundsToMessageText(container: HTMLElement, theme: string): void {
  const svgElement = container.querySelector('svg');
  if (!svgElement) return;

  // Find all messageText elements
  const messageTexts = svgElement.querySelectorAll('text.messageText');

  messageTexts.forEach(textElement => {
    try {
      // Get text dimensions and position
      const bbox = (textElement as SVGTextElement).getBBox();

      // Create background rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

      // Use exact text bounds to completely eliminate overlap issues
      rect.setAttribute('x', bbox.x.toString());
      rect.setAttribute('y', bbox.y.toString());
      rect.setAttribute('width', bbox.width.toString());
      rect.setAttribute('height', bbox.height.toString());

      // Set background color to match the main app background
      rect.setAttribute('fill', theme === 'dark' ? '#1a1a1a' : '#ffffff');
      rect.setAttribute('stroke', 'none');

      // Insert rect before text element in the same parent
      textElement.parentNode?.insertBefore(rect, textElement);

    } catch (error) {
      logger.warn('Failed to add background to message text:', error);
    }
  });
}
