#!/bin/bash
# Captures environment info to a log file via tee.
# Safe to run locally or in Claude Code on the web.
set -euo pipefail

LOG="${SETUP_LOG:-/tmp/setup-output.log}"

{
  echo "=== Setup run at $(date -u +%FT%TZ) ==="
  echo
  echo "## Working directory"
  pwd
  echo
  echo "## Git"
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "branch: $(git rev-parse --abbrev-ref HEAD)"
    echo "head:   $(git rev-parse HEAD)"
    echo "remote: $(git remote get-url origin 2>/dev/null || echo none)"
    echo "status:"
    git status --short || true
  else
    echo "(not a git repository)"
  fi
  echo
  echo "## Tool versions"
  for tool in node npm npx python python3 git; do
    if command -v "$tool" >/dev/null 2>&1; then
      printf "%-8s %s\n" "$tool" "$("$tool" --version 2>&1 | head -n1)"
    else
      printf "%-8s %s\n" "$tool" "(not installed)"
    fi
  done
  echo
  echo "## Repository contents"
  ls -la
  echo
  echo "## Dependency install"
  echo "No build step or package manifest — static HTML/CSS/JS project."
  echo
  echo "=== Setup complete at $(date -u +%FT%TZ) ==="
} 2>&1 | tee "$LOG"
