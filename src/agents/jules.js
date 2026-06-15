module.exports = {
  name: 'jules',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'jules' ||
    process.env.JULES_ACTIVE === '1' ||
    false,
  description: 'Google Jules AI coding agent',
};
