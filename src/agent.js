const path = require('path');
const generic = require('./agents/generic');
const commandcode = require('./agents/commandcode');
const opencode = require('./agents/opencode');
const codex = require('./agents/codex');
const cursor = require('./agents/cursor');
const aider = require('./agents/aider');
const claudeCode = require('./agents/claude-code');
const copilot = require('./agents/copilot');
const windsurf = require('./agents/windsurf');
const jules = require('./agents/jules');

/**
 * Built-in agent registry.
 * Order matters — earlier agents have higher auto-detect priority.
 */
const BUILTIN_AGENTS = [
  commandcode,
  opencode,
  codex,
  cursor,
  claudeCode,
  copilot,
  windsurf,
  aider,
  jules,
  generic,
];

const AGENT_MAP = Object.fromEntries(
  BUILTIN_AGENTS.map((a) => [a.name, a])
);

function resolve(args, cfg) {
  // 1. Explicit --agent flag overrides everything
  if (args.agent) {
    const match = AGENT_MAP[args.agent];
    if (match) return match;
    // Unknown agent name — return a dynamic profile
    return {
      name: args.agent,
      defaultSound: null,
      description: `User-specified agent "${args.agent}"`,
    };
  }

  // 2. Auto-detect: try each agent's detect() in order
  for (const agent of BUILTIN_AGENTS) {
    if (agent.detect()) {
      return agent;
    }
  }

  // 3. Config-based agent detection (env var in config)
  if (cfg.agents) {
    for (const [name, agentCfg] of Object.entries(cfg.agents)) {
      if (agentCfg.envVar && process.env[agentCfg.envVar]) {
        return {
          name,
          defaultSound: agentCfg.soundPaths?.default || agentCfg.sound || null,
          description: `Config-defined agent "${name}"`,
        };
      }
    }
  }

  // 4. Fallback to generic
  return generic;
}

function list() {
  return BUILTIN_AGENTS.map((a) => ({
    name: a.name,
    description: a.description,
  }));
}

module.exports = { resolve, list };
