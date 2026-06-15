const assert = require('node:assert');
const { describe, it } = require('node:test');
const cli = require('../src/cli');

describe('cli.parse', () => {
  it('parses a simple command after --', () => {
    const result = cli.parse(['node', 'script.js', '--', 'echo', 'hello']);
    assert.deepStrictEqual(result.command, ['echo', 'hello']);
    assert.strictEqual(result.showHelp, false);
  });

  it('handles no command', () => {
    const result = cli.parse(['node', 'script.js']);
    assert.deepStrictEqual(result.command, []);
  });

  it('parses --agent flag before --', () => {
    const result = cli.parse([
      'node', 'script.js',
      '--agent', 'commandcode',
      '--', 'npm', 'run', 'build',
    ]);
    assert.strictEqual(result.agent, 'commandcode');
    assert.deepStrictEqual(result.command, ['npm', 'run', 'build']);
  });

  it('parses --agent=value syntax', () => {
    const result = cli.parse([
      'node', 'script.js',
      '--agent=opencode',
      '--', 'ls',
    ]);
    assert.strictEqual(result.agent, 'opencode');
  });

  it('parses --sound flag', () => {
    const result = cli.parse([
      'node', 'script.js',
      '--sound', '/path/to/sound.wav',
      '--', 'make', 'test',
    ]);
    assert.strictEqual(result.sound, '/path/to/sound.wav');
  });

  it('parses --verbose', () => {
    const result = cli.parse(['node', 'script.js', '--verbose', '--', 'echo']);
    assert.strictEqual(result.verbose, true);
  });

  it('parses --no-fail-sound', () => {
    const result = cli.parse(['node', 'script.js', '--no-fail-sound', '--', 'test']);
    assert.strictEqual(result.noFailSound, true);
  });

  it('handles --help', () => {
    const result = cli.parse(['node', 'script.js', '--help']);
    assert.strictEqual(result.showHelp, true);
  });

  it('handles --version', () => {
    const result = cli.parse(['node', 'script.js', '--version']);
    assert.strictEqual(result.showVersion, true);
  });

  it('treats args without -- as solo command', () => {
    const result = cli.parse(['node', 'script.js', 'echo', 'hello']);
    assert.deepStrictEqual(result.command, ['echo', 'hello']);
  });

  it('parses --config flag', () => {
    const result = cli.parse([
      'node', 'script.js',
      '--config', '/path/to/config.json',
      '--', 'cmd',
    ]);
    assert.strictEqual(result.config, '/path/to/config.json');
  });
});
