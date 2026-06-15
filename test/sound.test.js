const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

const sound = require('../src/sound');
const isCI = !!process.env.CI;
const generic = require('../src/agents/generic');

function makeResult(exitCode) {
  return { exitCode, signal: null, duration: 0n };
}

function makeArgs(overrides = {}) {
  return {
    sound: null,
    agent: null,
    noFailSound: false,
    verbose: false,
    ...overrides,
  };
}

function makeCfg(overrides = {}) {
  const defaults = {
    sound: null,
    soundPaths: { default: null, success: null, failure: null },
    agents: {},
    quiet: false,
    timeout: 5000,
  };
  return { ...defaults, ...overrides };
}

describe('sound.resolveSoundPath', () => {
  it('uses CLI --sound flag when provided', () => {
    const p = sound.resolveSoundPath(
      makeResult(0),
      makeArgs({ sound: 'C:\\custom\\sound.wav' }),
      makeCfg(),
      generic
    );
    assert.ok(p.endsWith('sound.wav'));
  });

  it('uses bundled success.wav for exit code 0 by default', () => {
    const p = sound.resolveSoundPath(makeResult(0), makeArgs(), makeCfg(), generic);
    assert.ok(p.endsWith('success.wav'));
  });

  it('uses bundled failure.wav for non-zero exit by default', () => {
    const p = sound.resolveSoundPath(makeResult(1), makeArgs(), makeCfg(), generic);
    assert.ok(p.endsWith('failure.wav'));
  });

  it('uses global config soundPaths.success', () => {
    const p = sound.resolveSoundPath(
      makeResult(0),
      makeArgs(),
      makeCfg({ soundPaths: { success: '/global/success.wav' } }),
      generic
    );
    assert.strictEqual(p, path.resolve('/global/success.wav'));
  });

  it('uses global config soundPaths.failure', () => {
    const p = sound.resolveSoundPath(
      makeResult(1),
      makeArgs(),
      makeCfg({ soundPaths: { failure: '/global/failure.wav' } }),
      generic
    );
    assert.strictEqual(p, path.resolve('/global/failure.wav'));
  });

  it('uses agent config soundPaths.success over global', () => {
    const p = sound.resolveSoundPath(
      makeResult(0),
      makeArgs(),
      makeCfg({
        soundPaths: { success: '/global/success.wav' },
        agents: {
          generic: { soundPaths: { success: '/agent/success.wav' } },
        },
      }),
      generic
    );
    assert.strictEqual(p, path.resolve('/agent/success.wav'));
  });

  it('--no-fail-sound suppresses playback for non-zero exit', async () => {
    const result = await sound.play(
      makeResult(1),
      makeArgs({ noFailSound: true }),
      makeCfg(),
      generic
    );
    assert.strictEqual(result, undefined); // resolves immediately
  });
});

describe('sound.play', () => {
  it('resolves for bundled sounds that exist', { skip: !!isCI }, async () => {
    const result = await sound.play(
      makeResult(0),
      makeArgs(),
      makeCfg(),
      generic
    );
    assert.strictEqual(result, undefined);
  });
});
