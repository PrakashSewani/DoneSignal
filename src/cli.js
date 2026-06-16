function parse(argv) {
  // Strip node binary and script path
  const args = argv.slice(2);

  const result = {
    flags: [],
    command: [],
    subcommand: null,    // init, etc.
    subcommandArgs: [],  // args after subcommand
    agent: null,
    sound: null,
    config: null,
    noFailSound: false,
    playOnly: false,
    showSounds: false,
    verbose: false,
    showHelp: false,
    showVersion: false,
  };

  let seenDelimiter = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!seenDelimiter && arg === '--') {
      seenDelimiter = true;
      continue;
    }

    if (!seenDelimiter && arg.startsWith('--')) {
      // Parse flag (same as before)
      switch (arg) {
        case '--help':
        case '-h':
          result.showHelp = true;
          break;
        case '--version':
        case '-v':
          result.showVersion = true;
          break;
        case '--verbose':
          result.verbose = true;
          break;
        case '--no-fail-sound':
          result.noFailSound = true;
          break;
        case '--play':
          result.playOnly = true;
          break;
        case '--sounds':
          result.showSounds = true;
          break;
        default: {
          const eqIdx = arg.indexOf('=');
          let key, value;
          if (eqIdx !== -1) {
            key = arg.slice(0, eqIdx);
            value = arg.slice(eqIdx + 1);
          } else {
            key = arg;
            value = args[i + 1];
            if (value && !value.startsWith('-')) {
              i++;
            } else {
              value = null;
            }
          }

          switch (key) {
            case '--agent':
              result.agent = value;
              break;
            case '--sound':
              result.sound = value;
              break;
            case '--config':
              result.config = value;
              break;
            default:
              break;
          }
          break;
        }
      }
    } else if (!seenDelimiter && !result.subcommand && !arg.startsWith('-')) {
      // First non-flag, non-delimiter arg before -- is a subcommand
      if (arg === 'init') {
        result.subcommand = 'init';
        result.subcommandArgs = args.slice(i + 1);
        break;
      }
      // Otherwise treat as part of command
      result.command.push(arg);
    } else {
      result.command.push(arg);
    }
  }

  return result;
}

function helpText() {
  return `
Usage: donesignal [options] -- <command>
       donesignal init [project-dir]

Run a command and play a sound when it finishes.

Commands:
  init [dir]           Add DoneSignal directive to AGENTS.md (detects project root)

Supported agents: commandcode, opencode, codex, cursor, claude-code, copilot, windsurf, aider, jules

Options:
  --agent <name>       Agent type (see list above)
  --sound <path>       Override sound file path
  --no-fail-sound      Don't play sound on non-zero exit
  --play               Just play a sound and exit (for AGENTS.md integration)
  --sounds             Open the bundled sounds directory in your file manager
  --config <path>      Config file path
  --verbose            Verbose logging
  --version            Show version
  --help               Show this help

Examples:
  donesignal -- npm run build
  donesignal init
  donesignal --sounds
  donesignal --agent codex -- codex "fix the login bug"
  donesignal --sound ~/sounds/chime.wav -- node script.js
`.trim();
}

module.exports = { parse, helpText };
