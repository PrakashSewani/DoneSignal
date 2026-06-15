module.exports = {
  name: 'aider',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'aider' ||
    process.env.AIDER_ACTIVE === '1' ||
    false,
  description: 'Aider AI pair programming agent',
};
