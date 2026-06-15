# DoneSignal

Play a sound when your AI agent, script, build, or workflow finishes. Stop staring at terminals and let DoneSignal tell you when it's done.

## Install

```bash
npm install -g donesignal
```

## Usage

```bash
# Wrap any command — plays a sound on completion
donesignal -- npm run build
donesignal -- npx jest
donesignal -- make test

# Just play the completion sound (for AGENTS.md directives)
donesignal --play

# Override the sound file
donesignal --sound ~/sounds/chime.wav -- node script.js

# Don't play sound on failure
donesignal --no-fail-sound -- npm run risky-deploy

# Verbose mode (shows timing, agent detection)
donesignal --verbose -- npm test
```

## Quick Start — Agent Integration

The best way to use DoneSignal with AI coding agents:

```bash
# 1. Add the DoneSignal directive to AGENTS.md
donesignal init

# 2. The agent will now run `donesignal --play` after each task
```

DoneSignal works by adding a simple directive to your project's `AGENTS.md`. The agent reads this file at startup and will play a notification sound after every task it completes.

For **per-task** playback from the CLI (non-interactive), just wrap the command:

```bash
donesignal --agent codex -- codex "fix the login bug"
donesignal --agent aider -- aider --message "refactor auth"
```

## Supported Agents

DoneSignal works with any AI coding agent that reads `AGENTS.md`. The directive is agent-agnostic — just run `donesignal init` and it works.

### AGENTS.md Native Support

These agents read `AGENTS.md` natively and will follow the DoneSignal directive automatically:

| Agent | How It Works |
|-------|-------------|
| **OpenAI Codex** | Reads `AGENTS.md` at project root — `donesignal init` is all you need |
| **CommandCode** | Reads `AGENTS.md` — also supports `cc` wrapper for automatic init |
| **OpenCode** | Reads `AGENTS.md` via rules system |
| **Claude Code** | Reads `AGENTS.md` as project instructions |
| **GitHub Copilot** | Added native AGENTS.md support in August 2025 |
| **Cursor** | Reads `AGENTS.md` for project rules |
| **Windsurf** | Reads `AGENTS.md` for project context |
| **Google Jules** | Reads `AGENTS.md` for coding conventions |
| **Google Gemini CLI** | Configurable via `.gemini/settings.json` to read `AGENTS.md` |
| **Aider** | Configurable via `.aider.conf.yml`: `read: AGENTS.md` |
| **Factory** | Reads `AGENTS.md` natively |
| **Zed** | Supports `AGENTS.md` as AI rules |
| **Devin** | Reads `AGENTS.md` for project context |
| **Amp** | Reads `AGENTS.md` natively |
| **RooCode** | Reads `AGENTS.md` natively |
| **JetBrains Junie** | Reads `AGENTS.md` |
| **Kilo Code** | Reads `AGENTS.md` |
| **VS Code** (GitHub Copilot) | Reads `AGENTS.md` via Copilot coding agent |

### Agent Detection (Optional)

DoneSignal can auto-detect which agent ran the command and use agent-specific sounds. Set the environment variable:

| Agent | Detection Env Var |
|-------|-------------------|
| **CommandCode** | `DONESIGNAL_AGENT=commandcode` or `COMMAND_CODE_ACTIVE=1` |
| **OpenCode** | `DONESIGNAL_AGENT=opencode` or `OPENCODE_ACTIVE=1` |
| **OpenAI Codex** | `DONESIGNAL_AGENT=codex` or `CODEX_ACTIVE=1` |
| **Cursor** | `DONESIGNAL_AGENT=cursor` or `CURSOR_ACTIVE=1` |
| **Claude Code** | `DONESIGNAL_AGENT=claude-code` or `CLAUDE_CODE_ACTIVE=1` |
| **GitHub Copilot** | `DONESIGNAL_AGENT=copilot` or `COPILOT_ACTIVE=1` |
| **Windsurf** | `DONESIGNAL_AGENT=windsurf` or `WINDSURF_ACTIVE=1` |
| **Aider** | `DONESIGNAL_AGENT=aider` or `AIDER_ACTIVE=1` |
| **Google Jules** | `DONESIGNAL_AGENT=jules` or `JULES_ACTIVE=1` |
| **Generic** | Fallback (default) |

Use the `--agent` flag to manually specify:

```bash
donesignal --agent claude-code -- claude "write tests"
donesignal --agent copilot -- gh copilot explain "this code"
```

## Commands

```
donesignal init [dir]    Add DoneSignal directive to AGENTS.md (auto-detects project root)
donesignal --play        Play the completion sound (for agent AGENTS.md directives)
donesignal [opts] -- <command>    Wrap a command, play sound on completion
```

## The AGENTS.md Approach

DoneSignal takes a **generic** approach to agent integration — it uses the open `AGENTS.md` standard (stewarded by the Agentic AI Foundation under the Linux Foundation).

When you run `donesignal init`, it adds a simple section to your `AGENTS.md`:

```markdown
## DoneSignal

After completing each task (success or failure), always run `donesignal --play`
to play a notification sound. This tells me the task is finished.

```bash
donesignal --play
```

Don't skip this step.
```

Any agent that reads `AGENTS.md` will see this instruction and run the sound on completion. One directive, every agent, zero configuration.

## Configuration

Create `.donesignalrc` in your project root or home directory:

```json
{
  "soundPaths": {
    "default": "~/.donesignal/sounds/chime.wav",
    "success": "~/.donesignal/sounds/ding.wav",
    "failure": "~/.donesignal/sounds/buzz.wav"
  },
  "agents": {
    "commandcode": {
      "soundPaths": {
        "success": "~/.donesignal/sounds/commandcode-ding.wav"
      }
    }
  },
  "timeout": 5000,
  "quiet": false
}
```

Or add a `"donesignal"` key to your `package.json`.

## How It Works

1. DoneSignal **spawns your command** as a child process with full stdio passthrough
2. It **captures the exit code** and measures duration
3. On completion, it **plays a sound** — different sounds for success (exit 0) vs failure
4. The **sound is determined by priority**: CLI flag → agent config → global config → bundled sound
5. DoneSignal **exits with the same exit code** as your command
6. For agent integration, the **AGENTS.md directive** tells agents to run `donesignal --play` after every task

## Bundled Sounds

DoneSignal comes with three bundled WAV sounds:
- `success.wav` — bright chime (E5, 300ms)
- `failure.wav` — lower tone (E4, 500ms)
- `default.wav` — gentle chime (C5, 300ms)

Generate your own with the script:

```bash
node scripts/generate-sounds.js
```

## License

MIT
