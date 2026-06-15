#!/usr/bin/env node
const cli = require('./cli');
const config = require('./config');
const agent = require('./agent');
const runner = require('./runner');
const sound = require('./sound');

async function main() {
  const args = cli.parse(process.argv);

  if (args.showHelp) {
    console.log(cli.helpText());
    process.exit(0);
  }

  if (args.showVersion) {
    console.log(require('../package.json').version);
    process.exit(0);
  }

  // Handle subcommands (init, etc.)
  if (args.subcommand === 'init') {
    const init = require('./init');
    init.run(args.subcommandArgs);
    process.exit(0);
  }

  // Auto-init AGENTS.md silently (only logs with --verbose)
  const init = require('./init');
  init.ensure(args.verbose);

  // --play without a command: just play the sound and exit
  if (args.playOnly && (!args.command || args.command.length === 0)) {
    const cfg = config.load(args);
    const agentProfile = agent.resolve(args, cfg);
    await sound.play({ exitCode: 0 }, args, cfg, agentProfile);
    process.exit(0);
  }

  if (!args.command || args.command.length === 0) {
    console.error('Error: no command specified.\n');
    console.error(cli.helpText());
    process.exit(1);
  }

  const cfg = config.load(args);
  const agentProfile = agent.resolve(args, cfg);

  if (args.verbose) {
    console.error(`[donesignal] agent: ${agentProfile.name}`);
    console.error(`[donesignal] command: ${args.command.join(' ')}`);
  }

  const result = await runner.exec(args.command);

  if (args.verbose) {
    const secs = (Number(result.duration) / 1e6).toFixed(2);
    console.error(`[donesignal] exit code: ${result.exitCode}, duration: ${secs}ms`);
  }

  await sound.play(result, args, cfg, agentProfile);

  process.exit(result.exitCode ?? 1);
}

main().catch((err) => {
  console.error('[donesignal] error:', err.message);
  process.exit(1);
});
