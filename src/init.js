#!/usr/bin/env node
/**
 * donesignal init — Sets up AGENTS.md for DoneSignal integration.
 *
 * Creates or updates AGENTS.md in the current project with
 * a directive telling AI agents to run `donesignal` after
 * completing a task.
 *
 * This works with any agent that reads AGENTS.md:
 *   CommandCode, OpenCode, Claude Code, Cursor, etc.
 */
const fs = require('fs');
const path = require('path');

const AGENTS_FILE = 'AGENTS.md';

const DONESIGNAL_BLOCK = `## DoneSignal

Always run \`donesignal --play\` after **every** response — whether it's answering a question, completing a task, or finishing a conversation turn. No exceptions.

\`\`\`bash
donesignal --play
\`\`\`

Works with: CommandCode, OpenCode, OpenAI Codex, Cursor, Claude Code, GitHub Copilot, Windsurf, Aider, Jules, and any agent that reads AGENTS.md.
`;

const DIRECTIVE_HEADER = '## DoneSignal';

function findProjectRoot(startDir) {
  let dir = path.resolve(startDir);
  while (true) {
    if (fs.existsSync(path.join(dir, '.git')) ||
        fs.existsSync(path.join(dir, 'package.json')) ||
        fs.existsSync(path.join(dir, '.commandcode'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return startDir;
    dir = parent;
  }
}

/**
 * Replaces an existing ## DoneSignal section in content with the latest block.
 * If no section exists, returns content with the block appended.
 */
function _replaceOrAppend(content) {
  const idx = content.indexOf(DIRECTIVE_HEADER);
  if (idx === -1) {
    // No existing section — append
    return content + '\n' + DONESIGNAL_BLOCK;
  }
  // Find the next ## heading after the DoneSignal section
  const rest = content.slice(idx + DIRECTIVE_HEADER.length);
  const nextHeading = rest.search(/\n## /);
  const sectionEnd = nextHeading !== -1 ? idx + DIRECTIVE_HEADER.length + nextHeading : content.length;
  return content.slice(0, Math.max(0, idx)) + DONESIGNAL_BLOCK + content.slice(sectionEnd);
}

/**
 * Silent auto-init: ensures AGENTS.md has the latest DoneSignal directive.
 * Replaces old section if present. Only logs when verbose is true.
 */
function ensure(verbose) {
  const projectRoot = findProjectRoot(process.cwd());
  const agentsPath = path.join(projectRoot, AGENTS_FILE);

  let changed = false;

  if (fs.existsSync(agentsPath)) {
    const existing = fs.readFileSync(agentsPath, 'utf-8');
    const updated = _replaceOrAppend(existing);
    if (updated !== existing) {
      fs.writeFileSync(agentsPath, updated, 'utf-8');
      changed = true;
    }
  } else {
    fs.writeFileSync(agentsPath, DONESIGNAL_BLOCK, 'utf-8');
    changed = true;
  }

  if (verbose && changed) {
    console.error(`[donesignal] updated DoneSignal directive in ${agentsPath}`);
  }
  return changed;
}

function run(args) {
  const targetDir = args[0] || process.cwd();
  const projectRoot = findProjectRoot(targetDir);
  const agentsPath = path.join(projectRoot, AGENTS_FILE);
  const existing = fs.existsSync(agentsPath) ? fs.readFileSync(agentsPath, 'utf-8') : '';
  const updated = _replaceOrAppend(existing);

  if (updated === existing) {
    console.log(`DoneSignal directive already present in ${agentsPath}`);
    return;
  }

  fs.writeFileSync(agentsPath, updated, 'utf-8');
  console.log(`\u2713 Updated DoneSignal directive in ${agentsPath}`);
  console.log(`  Agents in this project will now run donesignal after completing tasks.`);
}

module.exports = { ensure, run };
