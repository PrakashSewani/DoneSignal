const assert = require('node:assert');
const { describe, it } = require('node:test');
const config = require('../src/config');

describe('config.DEFAULTS', () => {
  it('has expected default structure', () => {
    assert.strictEqual(config.DEFAULTS.sound, null);
    assert.deepStrictEqual(config.DEFAULTS.soundPaths, {
      default: null,
      success: null,
      failure: null,
    });
    assert.deepStrictEqual(config.DEFAULTS.agents, {});
    assert.strictEqual(config.DEFAULTS.timeout, 5000);
    assert.strictEqual(config.DEFAULTS.quiet, false);
  });
});

describe('config.load', () => {
  it('returns defaults when no config file exists', () => {
    const cfg = config.load({ config: null });
    assert.strictEqual(cfg.timeout, 5000);
    assert.strictEqual(cfg.quiet, false);
  });

  it('returns defaults for empty args', () => {
    const cfg = config.load({});
    assert.ok(cfg.timeout !== undefined);
  });
});
