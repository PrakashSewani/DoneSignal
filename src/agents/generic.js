const path = require('path');

module.exports = {
  name: 'generic',
  detect: () => false, // Always the fallback
  defaultSound: path.resolve(__dirname, '..', '..', 'sounds', 'default.wav'),
  description: 'Generic command/script wrapper',
};
