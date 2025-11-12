import { soundExists, getRandomSoundPath, getAllSounds } from './sounds/index';

const testPlugin = async () => {
  console.log('Testing Warcraft II Alliance sounds plugin...\n');

  // Test 1: Check if sounds exist
  console.log('1. Checking if sounds exist...');
  const testSound = 'human_selected1.wav';
  const exists = await soundExists(testSound, 'alliance');
  console.log(`   ${testSound} exists: ${exists}\n`);

  if (!exists) {
    console.log(
      '2. Bundled sounds are not present. Please run the installer to copy bundled assets.\n',
    );
  } else {
    console.log('2. Sounds already exist, skipping install.\n');
  }

  // Test 3: Verify sounds are available
  console.log('3. Verifying sounds...');
  const allSounds = getAllSounds();
  console.log(`   Total sounds defined: ${allSounds.length}`);

  // Check a few random sounds
  const soundsToCheck = ['human_selected1.wav', 'knight_acknowledge3.wav', 'elf_acknowledge3.wav'];
  for (const sound of soundsToCheck) {
    const soundExists_ = await soundExists(sound, 'alliance');
    console.log(`   ${sound}: ${soundExists_ ? '✓' : '✗'}`);
  }

  // Test 4: Get random sound path
  console.log('\n4. Testing random sound selection...');
  for (let i = 0; i < 3; i++) {
    const randomSoundPath = getRandomSoundPath();
    const filename = randomSoundPath.split('/').pop();
    console.log(`   Random sound ${i + 1}: ${filename}`);
  }

  console.log('\n✅ Plugin test completed!');
};

// Run the test only when explicitly enabled via env var
if (process.env.TEST_INTEGRATION === '1') {
  await testPlugin();
}
