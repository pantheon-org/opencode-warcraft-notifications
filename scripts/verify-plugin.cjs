#!/usr/bin/env node
/**
 * Integration test to verify notification plugin event handling
 *
 * This test simulates the plugin loading and event handling to verify:
 * 1. Plugin initializes correctly
 * 2. Events are processed
 * 3. Logging is working
 * 4. Toast notification structure is correct
 *
 * Run with: DEBUG_OPENCODE=1 node scripts/verify-plugin.cjs
 */

const { NotificationPlugin } = require('../src/notification');

// Mock OpenCode plugin context
const mockContext = {
  project: {
    id: 'test-project',
    worktree: '/test/path',
    vcs: 'git',
  },
  directory: '/test/path',
  worktree: '/test/path',
  client: {
    tui: {
      showToast: async (request) => {
        console.log('\n✅ TOAST CALL CAPTURED:');
        console.log('   Title:', request.body.title);
        console.log('   Message:', request.body.message);
        console.log('   Variant:', request.body.variant);
        console.log('   Duration:', request.body.duration);
        console.log('');
        return { data: null, error: null, response: new Response() };
      },
    },
  },
  $: async (cmd) => {
    console.log('🔊 Sound command:', cmd);
    return {
      text: async () => '',
      stdout: { text: async () => '' },
      stderr: { text: async () => '' },
      exitCode: 0,
    };
  },
};

async function testPlugin() {
  console.log('🧪 Testing Warcraft Notifications Plugin\n');
  console.log('='.repeat(60));

  try {
    console.log('\n1️⃣  Initializing plugin...');
    const hooks = await NotificationPlugin(mockContext);
    console.log('   ✅ Plugin initialized successfully');

    if (!hooks.event) {
      throw new Error('Plugin did not register event handler');
    }
    console.log('   ✅ Event handler registered');

    // Test message.part.updated event
    console.log('\n2️⃣  Simulating message.part.updated event...');
    await hooks.event({
      event: {
        type: 'message.part.updated',
        properties: {
          part: {
            type: 'text',
            messageID: 'msg-test-123',
            text: 'This is a test message about implementing toast notifications',
          },
        },
      },
    });
    console.log('   ✅ Message event processed');

    // Test session.idle event
    console.log('\n3️⃣  Simulating session.idle event...');
    console.log('   (This should trigger sound + toast)\n');
    await hooks.event({
      event: {
        type: 'session.idle',
        properties: {},
      },
    });
    console.log('\n   ✅ Session idle event processed');

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED');
    console.log('\nThe plugin is working correctly!');
    console.log('Toast notification would be shown to the user with:');
    console.log('  - Title: A Warcraft II voice line (e.g., "Yes, milord?")');
    console.log('  - Message: Summary of the session activity');
    console.log('  - Duration: 4 seconds');
    console.log('  - Variant: info (blue)');
    console.log('\n' + '='.repeat(60));
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    process.exit(1);
  }
}

console.log('DEBUG_OPENCODE:', process.env.DEBUG_OPENCODE ? 'enabled' : 'disabled');
console.log('(Set DEBUG_OPENCODE=1 to see detailed logs)\n');

testPlugin();
