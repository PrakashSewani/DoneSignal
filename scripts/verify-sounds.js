#!/usr/bin/env node
/**
 * Verifies all bundled sound files exist and are valid WAV files.
 * Runs during `npm publish` via prepublishOnly hook.
 */
const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '..', 'sounds');
const REQUIRED = ['default.wav', 'success.wav', 'failure.wav'];
const WAV_HEADER = Buffer.from('RIFF');

let ok = true;

for (const name of REQUIRED) {
  const file = path.join(SOUNDS_DIR, name);
  if (!fs.existsSync(file)) {
    console.error(`Missing: ${file}`);
    ok = false;
    continue;
  }
  const buf = fs.readFileSync(file).subarray(0, 4);
  if (!buf.equals(WAV_HEADER)) {
    console.error(`Invalid WAV header in ${file}`);
    ok = false;
  }
}

if (!ok) {
  console.error('Sound verification failed. Run: node scripts/generate-sounds.js');
  process.exit(1);
}

console.log('All sound files verified.');
