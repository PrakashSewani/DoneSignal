const path = require('path');

module.exports = {
  name: 'commandcode',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'commandcode' ||
    process.env.COMMAND_CODE_ACTIVE === '1' ||
    false,
  defaultSound: path.resolve(__dirname, '..', '..', 'sounds', 'default.wav'),
  description: 'CommandCode AI agent',
};
