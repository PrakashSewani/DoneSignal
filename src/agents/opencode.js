module.exports = {
  name: 'opencode',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'opencode' ||
    process.env.OPENCODE_ACTIVE === '1' ||
    false,
  description: 'OpenCode AI agent',
};
