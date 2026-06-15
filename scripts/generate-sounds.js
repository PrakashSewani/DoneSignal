/**
 * Generate bundled WAV sound files for DoneSignal.
 *
 * Creates three short chime tones:
 *   default.wav  — C5 (523 Hz), 300ms, gentle
 *   success.wav  — E5 (659 Hz), 300ms, bright
 *   failure.wav  — E4 (330 Hz), 500ms, lower
 *
 * PCM format: 16-bit mono, 44100 Hz sample rate.
 */
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const BITS_PER_SAMPLE = 16;
const NUM_CHANNELS = 1;

function createWav(samples) {
  const byteRate = SAMPLE_RATE * NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  const blockAlign = NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  const dataSize = samples.length * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(NUM_CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < samples.length; i++) {
    const offset = 44 + i * 2;
    buffer.writeInt16LE(samples[i], offset);
  }

  return buffer;
}

function generateSineWave(frequency, durationSec, amplitude = 0.7) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const maxAmp = (2 ** (BITS_PER_SAMPLE - 1) - 1) * amplitude;
  const samples = new Int16Array(numSamples);

  // Apply fade-in/out (10% each) for click-free playback
  const fadeLen = Math.floor(numSamples * 0.1);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sample = Math.sin(2 * Math.PI * frequency * t) * maxAmp;

    // Apply fade envelope
    if (i < fadeLen) {
      sample *= i / fadeLen; // fade in
    } else if (i > numSamples - fadeLen) {
      sample *= (numSamples - i) / fadeLen; // fade out
    }

    samples[i] = Math.round(sample);
  }

  return Array.from(samples);
}

// === Sound profiles ===
const sounds = {
  'default':  { freq: 523, dur: 0.3, amp: 0.6 },   // C5 — gentle chime
  'success':  { freq: 659, dur: 0.3, amp: 0.7 },   // E5 — bright
  'failure':  { freq: 330, dur: 0.5, amp: 0.5 },   // E4 — lower, softer
};

const soundsDir = path.resolve(__dirname, '..', 'sounds');
fs.mkdirSync(soundsDir, { recursive: true });

for (const [name, { freq, dur, amp }] of Object.entries(sounds)) {
  const samples = generateSineWave(freq, dur, amp);
  const wav = createWav(samples);
  const filePath = path.join(soundsDir, `${name}.wav`);
  fs.writeFileSync(filePath, wav);
  const size = (wav.length / 1024).toFixed(1);
  console.log(`Generated: ${filePath} (${size} KB, ${freq} Hz, ${(dur * 1000).toFixed(0)}ms)`);
}

console.log('Done.');
