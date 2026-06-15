const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const BUNDLED_DIR = path.resolve(__dirname, '..', 'sounds');

/** Cross-platform sound player detection */
function getPlayer() {
  if (process.platform === 'win32') return 'powershell';
  // macOS: afplay is built-in
  try { fs.accessSync('/usr/bin/afplay'); return 'afplay'; } catch {}
  // Linux: try common players
  for (const p of ['paplay', 'aplay', 'play']) {
    try { require('child_process').execSync(`which ${p}`, { stdio: 'ignore' }); return p; } catch {}
  }
  return null;
}

const PLAYER = getPlayer();

/**
 * Resolve the best sound path based on priority:
 *   1. --sound CLI flag
 *   2. Agent config success/failure
 *   3. Agent config default
 *   4. Global config success/failure
 *   5. Global config default
 *   6. Bundled sound
 */
function resolveSoundPath(result, args, cfg, agentProfile) {
  // 1. CLI override
  if (args.sound) {
    return path.resolve(args.sound);
  }

  // 2. Agent config success/failure
  const isSuccess = result.exitCode === 0;
  const soundKey = isSuccess ? 'success' : 'failure';
  const agentCfg = cfg.agents?.[agentProfile.name];

  if (agentCfg?.soundPaths?.[soundKey]) {
    return path.resolve(agentCfg.soundPaths[soundKey]);
  }
  if (agentCfg?.soundPaths?.default) {
    return path.resolve(agentCfg.soundPaths.default);
  }
  if (agentCfg?.sound) {
    return path.resolve(agentCfg.sound);
  }

  // 3. Global config success/failure
  if (cfg.soundPaths?.[soundKey]) {
    return path.resolve(cfg.soundPaths[soundKey]);
  }
  if (cfg.soundPaths?.default) {
    return path.resolve(cfg.soundPaths.default);
  }
  if (cfg.sound) {
    return path.resolve(cfg.sound);
  }

  // 4. Bundled success/failure fallback (respects exit code)
  const bundledSpecific = path.join(BUNDLED_DIR, `${soundKey}.wav`);
  if (fs.existsSync(bundledSpecific)) {
    return bundledSpecific;
  }

  // 5. Agent profile default sound
  if (agentProfile.defaultSound) {
    return agentProfile.defaultSound;
  }

  // 6. Bundled generic fallback
  return path.join(BUNDLED_DIR, 'default.wav');
}

/**
 * Play a sound file using the native system audio player.
 * Returns a promise. On failure, logs a warning instead of crashing.
 */
function play(result, args, cfg, agentProfile) {
  // Suppress failure sound if --no-fail-sound and exit code !== 0
  if (args.noFailSound && result.exitCode !== 0) {
    return Promise.resolve();
  }

  const soundPath = resolveSoundPath(result, args, cfg, agentProfile);
  const timeout = cfg.timeout ?? 5000;

  if (args.verbose) {
    console.error(`[donesignal] playing: ${soundPath}`);
  }

  if (!PLAYER) {
    if (args.verbose) console.error('[donesignal] no audio player found');
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      if (args.verbose) console.error('[donesignal] sound playback timed out');
      resolve();
    }, timeout);

    let child;
    if (PLAYER === 'powershell') {
      const psCmd = `(New-Object Media.SoundPlayer '${soundPath.replace(/'/g, "\\'")}').PlaySync();`;
      child = spawn('powershell', ['-Command', psCmd], { stdio: 'ignore', windowsHide: true });
    } else {
      child = spawn(PLAYER, [soundPath], { stdio: 'ignore' });
    }

    child.on('close', () => { clearTimeout(timer); resolve(); });
    child.on('error', (err) => { clearTimeout(timer); if (args.verbose) console.error(`[donesignal] playback error: ${err.message}`); resolve(); });

    // Fallback: beep the terminal bell for instant feedback
    try { process.stdout.write('\x07'); } catch {}
  });
}

module.exports = { play, resolveSoundPath };
