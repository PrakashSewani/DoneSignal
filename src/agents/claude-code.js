module.exports = {
  name: 'claude-code',
  detect: () =>
    process.env.DONESIGNAL_AGENT === 'claude-code' ||
    process.env.CLAUDE_CODE_ACTIVE === '1' ||
    false,
  description: 'Anthropic Claude Code CLI agent',
};
