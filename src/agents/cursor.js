module.exports = {
  name: 'cursor',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'cursor' ||
    process.env.CURSOR_ACTIVE === '1' ||
    false,
  description: 'Cursor AI code editor',
};
