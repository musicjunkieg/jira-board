#!/bin/bash
# SessionStart hook: runs the setup script and surfaces its log to Claude
# as additional context, so the assistant can see what ran at session boot.
set -euo pipefail

LOG="/tmp/setup-output.log"
SETUP="$CLAUDE_PROJECT_DIR/scripts/setup.sh"

# Run setup silently — its output is captured to LOG via the script's own tee.
if [ -x "$SETUP" ]; then
  SETUP_LOG="$LOG" bash "$SETUP" >/dev/null 2>&1 || true
fi

# Emit the log content as SessionStart additionalContext.
if [ -f "$LOG" ]; then
  python3 - "$LOG" <<'PY'
import json, sys
with open(sys.argv[1]) as f:
    content = f.read()
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": "Setup script output (from scripts/setup.sh):\n\n" + content
    }
}))
PY
fi
