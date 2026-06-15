const path = require('path');

function resolveSoundPath(input) {
  if (!input) return null;

  // Handle ~/ paths
  if (input.startsWith('~/')) {
    const home = process.env.HOME || process.env.USERPROFILE;
    return path.resolve(home, input.slice(2));
  }

  return path.resolve(input);
}

function formatDuration(ns) {
  const ms = Number(ns) / 1e6;
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  const secs = ms / 1000;
  if (secs < 60) return `${secs.toFixed(1)}s`;
  const mins = Math.floor(secs / 60);
  const remainSecs = secs % 60;
  return `${mins}m ${remainSecs.toFixed(0)}s`;
}

function log(verbose, msg) {
  if (verbose) {
    console.error(`[donesignal] ${msg}`);
  }
}

module.exports = { resolveSoundPath, formatDuration, log };
