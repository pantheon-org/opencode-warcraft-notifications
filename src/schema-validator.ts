import { z } from 'zod';
import { createLogger } from './logger.js';
import type { WarcraftNotificationConfig } from './plugin-config.js';

const log = createLogger({ module: 'opencode-plugin-warcraft-notifications' });

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether the configuration is valid */
  valid: boolean;
  /** Critical errors that must be fixed */
  errors?: string[];
  /** Non-critical warnings that should be addressed */
  warnings?: string[];
}

/**
 * Zod schema for Warcraft Notification Plugin configuration
 *
 * This schema validates the configuration structure and values according to
 * the JSON schema defined in docs/schemas/plugin.json.schema
 */
const warcraftConfigSchema = z
  .object({
    soundsDir: z
      .string()
      .optional()
      .describe('Directory where sound files should be stored and cached'),
    faction: z
      .enum(['alliance', 'horde', 'both'])
      .optional()
      .describe("Which faction sounds to use: 'alliance', 'horde', or 'both' (default: 'both')"),
  })
  .strict(); // Reject unknown properties

/**
 * Zod issue type for type safety
 */
interface ZodIssueData {
  path?: Array<string | number>;
  code?: string;
  message?: string;
  expected?: string;
  received?: unknown;
  values?: unknown[];
  keys?: string[];
  validation?: string;
  [key: string]: unknown;
}

/**
 * Format invalid_type error
 */
const formatInvalidTypeError = (path: string, issue: ZodIssueData): string => {
  const expected = issue.expected as string;
  const received = issue.received || 'undefined';
  return `${path}: Expected ${expected}, received ${received}`;
};

/**
 * Format a single enum option value
 */
const formatEnumOption = (o: unknown): string => `'${o}'`;

/**
 * Format invalid_value error (enum)
 */
const formatInvalidValueError = (path: string, issue: ZodIssueData): string => {
  const values = issue.values as unknown[];
  if (values && Array.isArray(values)) {
    const options = values.map(formatEnumOption).join(', ');
    return `${path}: Invalid enum value. Must be one of: ${options}`;
  }
  return `${path}: Invalid value`;
};

/**
 * Format unrecognized_keys error
 */
const formatUnrecognizedKeysError = (issue: ZodIssueData): string => {
  const keys = issue.keys as string[];
  if (keys && Array.isArray(keys)) {
    return `Unrecognized configuration key(s): ${keys.join(', ')}. Only 'soundsDir' and 'faction' are allowed.`;
  }
  return `Unrecognized configuration keys`;
};

/**
 * Format invalid_string error
 */
const formatInvalidStringError = (path: string, issue: ZodIssueData): string => {
  const validation = issue.validation as string;
  if (validation === 'url') {
    return `${path}: Must be a valid URL`;
  }
  return `${path}: Invalid string value`;
};

/**
 * Format a Zod error message to be more user-friendly
 *
 * @param issue - The Zod validation issue
 * @returns Formatted error message
 */
const formatZodIssue = (issue: ZodIssueData): string => {
  const pathArray = Array.isArray(issue.path) ? issue.path : [];
  const path = pathArray.join('.') || 'config';
  const code = issue.code as string;
  const message = issue.message as string;

  switch (code) {
    case 'invalid_type':
      return formatInvalidTypeError(path, issue);
    case 'invalid_value':
      return formatInvalidValueError(path, issue);
    case 'unrecognized_keys':
      return formatUnrecognizedKeysError(issue);
    case 'invalid_string':
      return formatInvalidStringError(path, issue);
    default:
      return `${path}: ${message || 'Validation failed'}`;
  }
};

/**
 * Wrapper for formatZodIssue to avoid nested callback
 */
const formatZodIssueWrapper = (issue: z.ZodIssue): string => formatZodIssue(issue as ZodIssueData);

/**
 * Format error message with indentation
 */
const formatErrorWithIndent = (err: string): string => `  - ${err}`;

/**
 * Validate plugin configuration against the schema
 *
 * This function validates the provided configuration object against the
 * defined Zod schema. It provides detailed, actionable error messages for
 * any validation failures.
 *
 * @param config - The configuration object to validate (unknown type for flexibility)
 * @returns Validation result with valid flag and any errors or warnings
 *
 * @example
 * ```typescript
 * // Valid configuration
 * const result = validatePluginConfig({ faction: 'alliance' });
 * // result.valid === true
 *
 * // Invalid configuration
 * const result = validatePluginConfig({ faction: 'night-elf' });
 * // result.valid === false
 * // result.errors === ["faction: Invalid value 'night-elf'. Must be one of: 'alliance', 'horde', 'both'"]
 * ```
 */
export const validatePluginConfig = (config: unknown): ValidationResult => {
  // Handle null or undefined config
  if (config === null || config === undefined) {
    return {
      valid: true,
      warnings: ['No configuration provided. Using default values.'],
    };
  }

  // Handle non-object config
  if (typeof config !== 'object') {
    return {
      valid: false,
      errors: [`Configuration must be an object. Received: ${typeof config}`],
    };
  }

  try {
    // Attempt to parse the configuration
    warcraftConfigSchema.parse(config);

    return {
      valid: true,
    };
  } catch (error) {
    // Parse Zod validation errors into user-friendly messages
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(formatZodIssueWrapper);

      return {
        valid: false,
        errors,
      };
    }

    // Handle unexpected errors
    return {
      valid: false,
      errors: [
        `Unexpected validation error: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
};

/**
 * Validate and sanitize plugin configuration
 *
 * This function validates the configuration and returns a typed, sanitized
 * version with defaults applied. If validation fails, it throws an error
 * with detailed messages.
 *
 * @param config - The configuration object to validate
 * @returns Validated and typed configuration object
 * @throws Error If validation fails with detailed error messages
 *
 * @example
 * ```typescript
 * try {
 *   const config = validateAndSanitizeConfig({ faction: 'alliance' });
 *   // config is now typed as WarcraftNotificationConfig
 * } catch (error) {
 *   log.error('Configuration invalid', { error });
 * }
 * ```
 */
export const validateAndSanitizeConfig = (config: unknown): WarcraftNotificationConfig => {
  const result = validatePluginConfig(config);

  if (!result.valid) {
    const errorMessage = [
      '[Warcraft Notifications] Configuration validation failed:',
      ...(result.errors || []).map(formatErrorWithIndent),
    ].join('\n');

    throw new Error(errorMessage);
  }

  // Log warnings if in debug mode
  if (result.warnings && process.env.DEBUG_OPENCODE) {
    log.warn('Configuration warnings');
    for (const warning of result.warnings) {
      log.warn(warning);
    }
  }

  // Return empty config if null/undefined (safe after validation)
  if (config === null || config === undefined) {
    return {};
  }

  // Return the validated config (type assertion is safe after validation)
  return config as WarcraftNotificationConfig;
};
