#!/usr/bin/env node
/**
 * donesignal-exec — Runs a single command and plays a sound on completion.
 *
 * Pass the command to execute as arguments:
 *   donesignal-exec npm run build
 *   donesignal-exec -- git commit -m "msg"
 *
 * Exits with the same exit code as the executed command.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const BUNDLED_DIR = path.resolve(__dirname, '..', 'sounds');

function playSound(soundPath) {
  const { spawn } = require('child_process');
  if (process.platform === 'win32') {
    const psCmd = `(New-Object Media.SoundPlayer '${soundPath.replace(/'/g, "\\'")}').PlaySync();`;
    spawn('powershell', ['-Command', psCmd], { stdio: 'ignore', windowsHide: true });
  } else {
    spawn('afplay', [soundPath], { stdio: 'ignore' });
  }
}

const args = process.argv.slice(2);

let cmdStart = 0;
let verbose = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--verbose' || args[i] === '-v') {
    verbose = true;
    cmdStart = i + 1;
  } else if (args[i] === '--') {
    cmdStart = i + 1;
    break;
  } else if (!args[i].startsWith('-')) {
    cmdStart = i;
    break;
  } else {
    cmdStart = i + 1;
  }
}

const commandArgs = args.slice(cmdStart);

if (commandArgs.length === 0) {
  console.error('[donesignal-exec] No command specified.');
  process.exit(1);
}

const REAL_SHELL = process.env.SystemRoot
  ? path.join(process.env.SystemRoot, 'System32', 'cmd.exe')
  : (process.env.SHELL || '/bin/sh');

const fullCommand = commandArgs.join(' ');

if (verbose) {
  console.error(`[donesignal-exec] command: ${fullCommand}`);
}

const start = process.hrtime.bigint();
let exitCode = 0;

const child = spawn(fullCommand, {
  stdio: 'inherit',
  shell: REAL_SHELL,
  windowsHide: true,
});

child.on('close', (code, signal) => {
  exitCode = code ?? (signal ? 1 : 0);
  const duration = process.hrtime.bigint() - start;
  const durationMs = Number(duration) / 1e6;

  if (verbose) {
    console.error(`[donesignal-exec] exit code: ${exitCode}, duration: ${durationMs.toFixed(1)}ms`);
  }

  const soundKey = exitCode === 0 ? 'success' : 'failure';
  const soundPath = path.join(BUNDLED_DIR, `${soundKey}.wav`);

  if (fs.existsSync(soundPath)) {
    if (verbose) {
      console.error(`[donesignal-exec] playing: ${soundPath}`);
    }
    playSound(soundPath);
  }

  // Wait long enough for the sound to play (PowerShell PlaySync is synchronous)
  setTimeout(() => process.exit(exitCode), 1500);
});

child.on('error', (err) => {
  if (verbose) {
    console.error(`[donesignal-exec] error: ${err.message}`);
  }
  process.exit(1);
});
