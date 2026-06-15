const { spawn } = require('child_process');

function exec(commandArray) {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();

    const cmd = commandArray[0];
    const args = commandArray.slice(1);

    const opts = { stdio: 'inherit' };

    // Windows needs shell: true for cmd.exe built-ins (echo, dir, etc.)
    // and for batch files. Pass full command as string to avoid
    // Node.js DEP0190 deprecation warning.
    if (process.platform === 'win32') {
      opts.shell = true;
      opts.windowsHide = true;
    }

    const child = opts.shell
      ? spawn([cmd, ...args].join(' '), opts)
      : spawn(cmd, args, opts);

    // Forward termination signals to child
    const onSignal = (signal) => {
      if (!child.killed) {
        child.kill(signal);
      }
    };

    process.on('SIGINT', onSignal);
    process.on('SIGTERM', onSignal);

    child.on('close', (exitCode, signal) => {
      process.off('SIGINT', onSignal);
      process.off('SIGTERM', onSignal);

      const duration = process.hrtime.bigint() - start;
      resolve({
        exitCode: exitCode ?? (signal ? 1 : 0),
        signal,
        duration,
      });
    });

    child.on('error', (err) => {
      process.off('SIGINT', onSignal);
      process.off('SIGTERM', onSignal);

      const duration = process.hrtime.bigint() - start;
      resolve({
        exitCode: 1,
        signal: null,
        duration,
        error: err.message,
      });
    });
  });
}

module.exports = { exec };
