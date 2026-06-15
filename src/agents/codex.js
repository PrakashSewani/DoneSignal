module.exports = {
  name: 'codex',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'codex' ||
    process.env.CODEX_ACTIVE === '1' ||
    false,
  description: 'OpenAI Codex CLI agent',
};
