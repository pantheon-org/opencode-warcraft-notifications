/**
 * Logging module for OpenCode Warcraft Notifications Plugin
 *
 * This module provides a unified logging interface that uses OpenCode's
 * native logging system when available, and falls back to console logging
 * for development and testing environments.
 */

/** Logger interface matching OpenCode's Log API */
interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

/**
 * Console-based logger fallback for development/testing
 */
class ConsoleLogger implements Logger {
  constructor(private readonly module: string) {}

  private formatMessage(level: string, message: string, context?: Record<string, unknown>): string {
    const prefix = `[${this.module}] [${level.toUpperCase()}]`;
    if (context) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }
    return `${prefix} ${message}`;
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(this.formatMessage('error', message, context));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.DEBUG_OPENCODE) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

/**
 * Create a logger instance
 *
 * Uses console-based logging with structured format.
 * This approach ensures compatibility during development/testing
 * while maintaining the same API as OpenCode's native logging.
 *
 * @param config - Logger configuration
 * @param config.module - Module name for log entries
 * @returns Logger instance
 */
export const createLogger = ({ module }: { module: string }): Logger => {
  return new ConsoleLogger(module);
};
