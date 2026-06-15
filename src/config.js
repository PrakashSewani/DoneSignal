const { cosmiconfig } = require('cosmiconfig');

const moduleName = 'donesignal';

const DEFAULTS = {
  sound: null,
  soundPaths: {
    default: null,
    success: null,
    failure: null,
  },
  agents: {},
  quiet: false,
  timeout: 5000,
};

function load(args) {
  const cfg = { ...DEFAULTS };

  // Merge from config file if available
  try {
    const explorer = cosmiconfig(moduleName, {
      searchPlaces: args.config ? [args.config] : undefined,
    });

    // Synchronous-ish: we search synchronously for CLI simplicity
    // cosmiconfig is async, but we can do sync search via package.json
    let result = null;
    explorer.search().then((r) => {
      result = r;
    });

    // Fallback: use a timeout-driven approach
    // For simplicity, we do a quick sync require check
    _tryLoadSync(cfg);
  } catch {
    // Silently fall back to defaults
  }

  return cfg;
}

/**
 * Quick synchronous config loading using require.resolve + read.
 * This is a fallback when cosmiconfig's async nature is inconvenient
 * for a CLI tool that starts and exits quickly.
 */
function _tryLoadSync(cfg) {
  const fs = require('fs');
  const path = require('path');

  // Search locations relative to CWD
  const searchLocations = [
    path.resolve(process.cwd(), '.donesignalrc'),
    path.resolve(process.cwd(), '.donesignalrc.json'),
    path.resolve(process.cwd(), '.donesignalrc.yaml'),
    path.resolve(process.cwd(), '.donesignalrc.yml'),
    path.resolve(process.cwd(), '.donesignalrc.js'),
    path.resolve(process.cwd(), 'donesignal.config.js'),
  ];

  for (const loc of searchLocations) {
    if (fs.existsSync(loc)) {
      try {
        const raw = fs.readFileSync(loc, 'utf-8');
        const parsed = JSON.parse(raw);
        _merge(cfg, parsed);
        return;
      } catch {
        // Try next location
      }
    }
  }

  // Check package.json for donesignal key
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.donesignal) {
        _merge(cfg, pkg.donesignal);
      }
    } catch {
      // ignore
    }
  }
}

function _merge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      _merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

module.exports = { load, DEFAULTS };
