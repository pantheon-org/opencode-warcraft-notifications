/**
 * Logging module for OpenCode Warcraft Notifications Plugin
 *
 * This module provides structured logging that follows OpenCode conventions.
 * Logs are output through stderr/stdout where OpenCode can capture and process them.
 */

/** Logger interface matching OpenCode's Log API */
export interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

/**
 * Structured logger implementation for OpenCode plugins
 *
 * Outputs structured JSON logs that OpenCode can parse and display appropriately.
 * Uses stderr for warnings/errors and stdout for info/debug messages.
 */
class StructuredLogger implements Logger {
  constructor(private readonly module: string) {}

  private log(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    context?: Record<string, unknown>,
  ): void {
    const logEntry = {
      level,
      module: this.module,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
    };

    // Output structured JSON to appropriate stream
    const output = JSON.stringify(logEntry);
    if (level === 'error' || level === 'warn') {
      process.stderr.write(output + '\n');
    } else {
      process.stdout.write(output + '\n');
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.DEBUG_OPENCODE) {
      this.log('debug', message, context);
    }
  }
}

/**
 * Create a logger instance for OpenCode plugins
 *
 * Creates a structured logger that outputs JSON-formatted logs to stdout/stderr.
 * This allows OpenCode to capture, parse, and display logs appropriately in its UI.
 *
 * - Info/debug logs go to stdout
 * - Warn/error logs go to stderr
 * - All logs include timestamp, level, module name, and optional context
 * - Debug logs only output when DEBUG_OPENCODE environment variable is set
 *
 * @param options - Logger configuration options
 * @returns Logger instance with structured logging
 */
export const createLogger = ({ module }: { module: string }): Logger => {
  return new StructuredLogger(module);
};
