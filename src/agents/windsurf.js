module.exports = {
  name: 'windsurf',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'windsurf' ||
    process.env.WINDSURF_ACTIVE === '1' ||
    false,
  description: 'Codeium Windsurf AI code editor',
};
