@ECHO off
SETLOCAL ENABLEDELAYEDEXPANSION

REM DoneSignal wrapper for CommandCode
REM Usage: cc [commandcode-args...]
REM
REM 1. Adds DoneSignal directive to AGENTS.md (so the agent knows
REM    to run `donesignal --play` after each task).
REM 2. Sets DONESIGNAL_AGENT so DoneSignal uses the commandcode profile.
REM 3. Runs CommandCode through DoneSignal so the initial exit chime works too.

SET "DONESIGNAL_AGENT=commandcode"

WHERE donesignal >nul 2>nul
IF ERRORLEVEL 1 (
    ECHO Error: donesignal not found. Install with: npm install -g donesignal
    EXIT /b 1
)

REM Auto-setup AGENTS.md (silent, only runs once)
donesignal init >nul 2>nul

donesignal --agent commandcode -- commandcode %*
EXIT /b !ERRORLEVEL!
