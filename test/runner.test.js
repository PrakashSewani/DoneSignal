const assert = require('node:assert');
const { describe, it } = require('node:test');
const runner = require('../src/runner');

describe('runner.exec', () => {
  it('runs a command and returns exit code 0', async () => {
    const result = await runner.exec(
      process.platform === 'win32'
        ? ['cmd', '/c', 'echo', 'test']
        : ['echo', 'test']
    );
    assert.strictEqual(result.exitCode, 0);
    assert.ok(typeof result.duration === 'bigint');
  });

  it('captures non-zero exit codes', async () => {
    const result = await runner.exec(
      process.platform === 'win32'
        ? ['cmd', '/c', 'exit', '1']
        : ['bash', '-c', 'exit 1']
    );
    assert.strictEqual(result.exitCode, 1);
  });

  it('returns a duration in nanoseconds', async () => {
    const result = await runner.exec(
      process.platform === 'win32'
        ? ['cmd', '/c', 'echo', 'test']
        : ['echo', 'test']
    );
    assert.ok(Number(result.duration) > 0);
  });

  it('handles empty command gracefully', async () => {
    const result = await runner.exec(
      process.platform === 'win32' ? ['cmd', '/c'] : ['echo']
    );
    assert.ok(result.exitCode !== undefined);
  });
});
