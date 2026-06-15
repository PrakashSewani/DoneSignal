const assert = require('node:assert');
const { describe, it, beforeEach } = require('node:test');
const agent = require('../src/agent');
const generic = require('../src/agents/generic');

describe('agent.resolve', () => {
  beforeEach(() => {
    delete process.env.DONESIGNAL_AGENT;
    delete process.env.COMMAND_CODE_ACTIVE;
  });

  it('resolves to generic agent by default', () => {
    const result = agent.resolve({ agent: null }, { agents: {} });
    assert.strictEqual(result.name, 'generic');
  });

  it('resolves from --agent flag', () => {
    const result = agent.resolve({ agent: 'commandcode' }, { agents: {} });
    assert.strictEqual(result.name, 'commandcode');
  });

  it('returns dynamic profile for unknown agent name from --agent', () => {
    const result = agent.resolve({ agent: 'unknown-agent-xyz' }, { agents: {} });
    assert.strictEqual(result.name, 'unknown-agent-xyz');
    assert.strictEqual(result.defaultSound, null);
  });

  it('detects commandcode via DONESIGNAL_AGENT env var', () => {
    process.env.DONESIGNAL_AGENT = 'commandcode';
    const result = agent.resolve({ agent: null }, { agents: {} });
    assert.strictEqual(result.name, 'commandcode');
  });

  it('detects commandcode via COMMAND_CODE_ACTIVE env var', () => {
    process.env.COMMAND_CODE_ACTIVE = '1';
    const result = agent.resolve({ agent: null }, { agents: {} });
    assert.strictEqual(result.name, 'commandcode');
  });

  it('--agent flag overrides env detection', () => {
    process.env.DONESIGNAL_AGENT = 'commandcode';
    const result = agent.resolve({ agent: 'generic' }, { agents: {} });
    assert.strictEqual(result.name, 'generic');
  });

  it('resolves config-defined agent via env var', () => {
    process.env.MY_CUSTOM_AGENT = '1';
    const result = agent.resolve(
      { agent: null },
      {
        agents: {
          'custom-agent': { envVar: 'MY_CUSTOM_AGENT' },
        },
      }
    );
    assert.strictEqual(result.name, 'custom-agent');
  });
});

describe('agent.list', () => {
  it('returns all built-in agents', () => {
    const agents = agent.list();
    assert.ok(agents.length >= 2);
    assert.ok(agents.find((a) => a.name === 'generic'));
    assert.ok(agents.find((a) => a.name === 'commandcode'));
  });
});
