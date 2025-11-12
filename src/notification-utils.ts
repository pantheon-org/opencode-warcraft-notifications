/**
 * Utility functions for notification handling
 */

/**
 * Extract filename from a full file path
 *
 * @param path - Full file path (e.g., "/path/to/file.wav")
 * @returns The filename (e.g., "file.wav")
 *
 * @example
 * ```typescript
 * extractFilename("/Users/john/sounds/orc_selected1.wav")
 * // Returns: "orc_selected1.wav"
 * ```
 */
export const extractFilename = (path: string): string => {
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
};

/**
 * Extract a short idle summary from the end of a message text.
 *
 * If the text contains a line like `Summary: ...` it returns that; otherwise it
 * truncates the text to 80 characters.
 *
 * @param text - Message text to extract the summary from
 * @returns The extracted summary or `undefined` when no text is provided
 *
 * @example
 * ```typescript
 * // Extract from markdown summary
 * getIdleSummary('Some work\n**Summary:** Task completed')
 * // Returns: "Task completed"
 *
 * // Truncate long text
 * getIdleSummary('a'.repeat(100))
 * // Returns: "aaaa...aaa..." (80 chars + "...")
 *
 * // Return short text as-is
 * getIdleSummary('Short message')
 * // Returns: "Short message"
 * ```
 */
export const getIdleSummary = (text: string | null): string | undefined => {
  if (!text) return;

  // Try to extract summary from markdown format (e.g., "**Summary:** content")
  // Matches: [*_]Summary:[*_]? followed by content, optionally ending with [*_]
  // Uses multiline mode to match at end of any line
  const idleMatch = text.match(/[_*]+Summary:[_*]*\s*(.+?)[_*]*$/m);
  if (idleMatch && idleMatch[1]) {
    return idleMatch[1].trim();
  }

  // Truncate long text to 80 characters
  if (text.length > 80) {
    return text.slice(0, 80) + '...';
  }

  return text;
};
