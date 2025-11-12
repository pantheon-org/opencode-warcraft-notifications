import { describe, it, expect, spyOn, beforeEach, afterEach } from 'bun:test';
import { createLogger } from './logger';

describe('Logger', () => {
  const moduleName = 'test-module';
  let stdoutSpy: ReturnType<typeof spyOn>;
  let stderrSpy: ReturnType<typeof spyOn>;
  let originalDebugEnv: string | undefined;

  beforeEach(() => {
    stdoutSpy = spyOn(process.stdout, 'write');
    stderrSpy = spyOn(process.stderr, 'write');
    originalDebugEnv = process.env.DEBUG_OPENCODE;
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
    process.env.DEBUG_OPENCODE = originalDebugEnv;
  });

  describe('info', () => {
    it('should output structured JSON to stdout', () => {
      const logger = createLogger({ module: moduleName });
      logger.info('Test info message');

      expect(stdoutSpy).toHaveBeenCalledTimes(1);
      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed).toMatchObject({
        level: 'info',
        module: moduleName,
        message: 'Test info message',
      });
      expect(parsed.timestamp).toBeDefined();
    });

    it('should include context when provided', () => {
      const logger = createLogger({ module: moduleName });
      const context = { userId: '123', action: 'test' };
      logger.info('Test with context', context);

      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed.context).toEqual(context);
    });
  });

  describe('warn', () => {
    it('should output structured JSON to stderr', () => {
      const logger = createLogger({ module: moduleName });
      logger.warn('Test warning message');

      expect(stderrSpy).toHaveBeenCalledTimes(1);
      const output = stderrSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed).toMatchObject({
        level: 'warn',
        module: moduleName,
        message: 'Test warning message',
      });
    });

    it('should include context when provided', () => {
      const logger = createLogger({ module: moduleName });
      const context = { reason: 'deprecation' };
      logger.warn('Deprecated feature', context);

      const output = stderrSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed.context).toEqual(context);
    });
  });

  describe('error', () => {
    it('should output structured JSON to stderr', () => {
      const logger = createLogger({ module: moduleName });
      logger.error('Test error message');

      expect(stderrSpy).toHaveBeenCalledTimes(1);
      const output = stderrSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed).toMatchObject({
        level: 'error',
        module: moduleName,
        message: 'Test error message',
      });
    });

    it('should include error context when provided', () => {
      const logger = createLogger({ module: moduleName });
      const error = new Error('Test error');
      logger.error('Operation failed', { error: error.message });

      const output = stderrSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed.context).toMatchObject({ error: 'Test error' });
    });
  });

  describe('debug', () => {
    it('should not output when DEBUG_OPENCODE is not set', () => {
      delete process.env.DEBUG_OPENCODE;
      const logger = createLogger({ module: moduleName });
      logger.debug('Test debug message');

      expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('should output to stdout when DEBUG_OPENCODE is set', () => {
      process.env.DEBUG_OPENCODE = 'true';
      const logger = createLogger({ module: moduleName });
      logger.debug('Test debug message');

      expect(stdoutSpy).toHaveBeenCalledTimes(1);
      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed).toMatchObject({
        level: 'debug',
        module: moduleName,
        message: 'Test debug message',
      });
    });

    it('should include context when DEBUG_OPENCODE is set', () => {
      process.env.DEBUG_OPENCODE = 'true';
      const logger = createLogger({ module: moduleName });
      const context = { variable: 'value' };
      logger.debug('Debug info', context);

      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed.context).toEqual(context);
    });
  });

  describe('structured output format', () => {
    it('should output valid JSON for all log levels', () => {
      process.env.DEBUG_OPENCODE = 'true';
      const logger = createLogger({ module: moduleName });

      logger.info('Info test');
      logger.warn('Warn test');
      logger.error('Error test');
      logger.debug('Debug test');

      const allCalls = [
        ...stdoutSpy.mock.calls.map((c: unknown[]) => c[0] as string),
        ...stderrSpy.mock.calls.map((c: unknown[]) => c[0] as string),
      ];

      allCalls.forEach((output) => {
        expect(() => JSON.parse(output)).not.toThrow();
      });
    });

    it('should include timestamp in ISO format', () => {
      const logger = createLogger({ module: moduleName });
      logger.info('Timestamp test');

      const output = stdoutSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(output);

      expect(parsed.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
