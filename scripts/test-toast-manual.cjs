#!/usr/bin/env node
/**
 * Manual test script to verify toast notifications work
 *
 * NOTE: This script requires the OpenCode SDK server to be running.
 * The SDK server is only available when a plugin is loaded by OpenCode,
 * not from standalone scripts.
 *
 * To properly test toast notifications:
 * 1. Build the plugin: npm run build
 * 2. Install it in OpenCode via opencode.json
 * 3. Enable debug logging: DEBUG_OPENCODE=1 opencode
 * 4. Trigger a session idle event
 *
 * This script is kept for reference but cannot run standalone.
 */

const { createOpencodeClient } = require('@opencode-ai/sdk');

async function testToast() {
  console.log('Testing toast notification...');
  console.log('');
  console.log('⚠️  WARNING: This test cannot run standalone!');
  console.log('');
  console.log('The OpenCode SDK client is only available when the plugin is loaded by OpenCode.');
  console.log(
    'The SDK server runs within the OpenCode process and is passed to plugins via context.',
  );
  console.log('');
  console.log('To test toast notifications properly:');
  console.log('  1. Install this plugin in OpenCode (via opencode.json)');
  console.log('  2. Run: DEBUG_OPENCODE=1 opencode');
  console.log('  3. Wait for a session to go idle or trigger one manually');
  console.log('  4. Watch the logs for toast notification attempts');
  console.log('');
  console.log('Expected log output:');
  console.log('  {"level":"info","message":"Session idle event received - handling notification"}');
  console.log('  {"level":"info","message":"Attempting to show toast notification"}');
  console.log('  {"level":"info","message":"Calling client.tui.showToast..."}');
  console.log('  {"level":"info","message":"Toast notification sent successfully"}');
  console.log('');

  // Attempt connection anyway to demonstrate the issue
  try {
    const client = createOpencodeClient({ baseUrl: 'http://localhost:4096' });
    await client.tui.showToast({
      body: {
        title: 'Yes, milord?',
        message: 'This is a test toast notification',
        variant: 'info',
        duration: 4000,
      },
    });
    console.log('✓ Toast notification sent successfully');
  } catch (error) {
    console.log(
      '✗ Expected error (SDK server not available in standalone mode):',
      error.message || String(error),
    );
  }
}

testToast();
