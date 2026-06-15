module.exports = {
  name: 'copilot',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'copilot' ||
    process.env.COPILOT_ACTIVE === '1' ||
    false,
  description: 'GitHub Copilot coding agent',
};
