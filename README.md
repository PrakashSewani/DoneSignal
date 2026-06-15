# DoneSignal

Play a sound when your AI agent, script, build, or workflow finishes. Stop staring at terminals and let DoneSignal tell you when it's done.

## Install

```bash
npm install -g donesignal
```

DoneSignal will auto-install its AGENTS.md directive in every project it runs in — no extra setup needed.

## Usage

```bash
# Wrap any command — plays a sound on completion
donesignal -- npm run build
donesignal -- npx jest
donesignal -- make test

# Just play the completion sound (for agent AGENTS.md directives)
donesignal --play

# Override the sound file
donesignal --sound ~/sounds/chime.wav -- node script.js

# Don't play sound on failure
donesignal --no-fail-sound -- npm run risky-deploy

# Verbose mode (shows timing, agent detection)
donesignal --verbose -- npm test
```

## Quick Start

**No manual `donesignal init` needed** — DoneSignal automatically adds its directive to `AGENTS.md` on first use. Just install and run:

```bash
donesignal --play
```

This plays a sound and silently ensures the `AGENTS.md` directive exists in the current project. Future agent sessions will see the directive and play sounds on completion automatically.

If you want the explicit init command:

```bash
donesignal init
```

But you'll rarely need it — every `donesignal --play` or `donesignal -- <command>` keeps AGENTS.md up to date automatically.

## The AGENTS.md Directive

DoneSignal uses the open `AGENTS.md` standard (stewarded by the Agentic AI Foundation under the Linux Foundation). Every time it runs, it ensures this directive is present in your project:

```markdown
## DoneSignal

Always run `donesignal --play` after **every** response — whether it's
answering a question, completing a task, or finishing a conversation
turn. No exceptions.

```bash
donesignal --play
```

Works with: CommandCode, OpenCode, OpenAI Codex, Cursor, Claude Code,
GitHub Copilot, Windsurf, Aider, Jules, and any agent that reads
AGENTS.md.
```

Already have an old version? DoneSignal replaces it automatically — you don't need to lift a finger.

## Supported Agents

Works with any agent that reads `AGENTS.md`. The directive is agent-agnostic — one directive, every agent, zero configuration.

| Agent | Support |
|-------|---------|
| **OpenAI Codex** | Native AGENTS.md |
| **CommandCode** | Native AGENTS.md + automatic init |
| **Claude Code** | Native AGENTS.md |
| **OpenCode** | AGENTS.md via rules system |
| **GitHub Copilot** | Native AGENTS.md |
| **Cursor** | Native AGENTS.md |
| **Windsurf** | Native AGENTS.md |
| **Aider** | Configurable via `.aider.conf.yml` |
| **Google Jules** | Native AGENTS.md |
| **Devin, Factory, Zed, Amp, RooCode, Kilo Code, Junie** | Native AGENTS.md |

### Agent Detection (Optional)

DoneSignal can auto-detect the agent and use agent-specific sounds.

```bash
# Manual override
donesignal --agent claude-code -- claude "write tests"
```

Detection env vars:

| Agent | Env Var |
|-------|---------|
| CommandCode | `DONESIGNAL_AGENT=commandcode` or `COMMAND_CODE_ACTIVE=1` |
| OpenCode | `DONESIGNAL_AGENT=opencode` or `OPENCODE_ACTIVE=1` |
| OpenAI Codex | `DONESIGNAL_AGENT=codex` or `CODEX_ACTIVE=1` |
| Cursor | `DONESIGNAL_AGENT=cursor` or `CURSOR_ACTIVE=1` |
| Claude Code | `DONESIGNAL_AGENT=claude-code` or `CLAUDE_CODE_ACTIVE=1` |
| GitHub Copilot | `DONESIGNAL_AGENT=copilot` or `COPILOT_ACTIVE=1` |
| Windsurf | `DONESIGNAL_AGENT=windsurf` or `WINDSURF_ACTIVE=1` |
| Aider | `DONESIGNAL_AGENT=aider` or `AIDER_ACTIVE=1` |
| Google Jules | `DONESIGNAL_AGENT=jules` or `JULES_ACTIVE=1` |

## Commands

```
donesignal init [dir]       Explicitly add/update the AGENTS.md directive
donesignal --play           Play the completion sound (auto-updates AGENTS.md)
donesignal [opts] -- <cmd>  Wrap a command, play sound on completion
donesignal --help           Show help
```

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
3. On completion, it **plays a sound** — different sounds for success vs failure
4. The **sound is determined by priority**: CLI flag → agent config → global config → bundled sound
5. DoneSignal **exits with the same exit code** as your command
6. For agent integration, it **auto-ensures the AGENTS.md directive** is present in the project

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
