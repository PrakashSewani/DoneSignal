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

After completing each task (success or failure), always run \`donesignal --play\` to play a notification sound. This tells me the task is finished.

\`\`\`bash
donesignal --play
\`\`\`

Don't skip this step. Works with: CommandCode, OpenCode, OpenAI Codex, Cursor, Claude Code, GitHub Copilot, Windsurf, Aider, Jules, and any agent that reads AGENTS.md.
`;

function findProjectRoot(startDir) {
  let dir = path.resolve(startDir);
  while (true) {
    // Check for common project root markers
    if (fs.existsSync(path.join(dir, '.git')) ||
        fs.existsSync(path.join(dir, 'package.json')) ||
        fs.existsSync(path.join(dir, '.commandcode'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return startDir; // Hit filesystem root
    dir = parent;
  }
}

function run(args) {
  const targetDir = args[0] || process.cwd();
  const projectRoot = findProjectRoot(targetDir);
  const agentsPath = path.join(projectRoot, AGENTS_FILE);

  let content = '';
  let alreadyPresent = false;

  if (fs.existsSync(agentsPath)) {
    content = fs.readFileSync(agentsPath, 'utf-8');
    if (content.includes('## DoneSignal')) {
      alreadyPresent = true;
      console.log(`DoneSignal directive already present in ${agentsPath}`);
      return;
    }
    // Append to existing file
    content += '\n' + DONESIGNAL_BLOCK;
  } else {
    content = DONESIGNAL_BLOCK;
  }

  fs.writeFileSync(agentsPath, content, 'utf-8');
  console.log(`✓ Added DoneSignal directive to ${agentsPath}`);
  console.log(`  Agents in this project will now run donesignal after completing tasks.`);
}

module.exports = { run };
