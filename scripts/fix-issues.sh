#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# fix-issues.sh — Autonomous bug-fixing via Claude Code (headless)
#
# Fetches GitHub issues labeled "ready", fixes them all in one
# branch/PR, runs build + tests, and opens a PR for review.
#
# Usage:
#   # Interactive (prompts for missing env vars):
#   ./scripts/fix-issues.sh
#
#   # Fully automated (all vars pre-set):
#   ANTHROPIC_API_KEY=... GITHUB_TOKEN=... ./scripts/fix-issues.sh
#
#   # With custom label / limit:
#   ISSUE_LABEL=bug ISSUE_LIMIT=5 ./scripts/fix-issues.sh
# ──────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────
REPO="rusel95/astro-web"
BRANCH_PREFIX="auto-fix"
ISSUE_LABEL="${ISSUE_LABEL:-ready}"
ISSUE_LIMIT="${ISSUE_LIMIT:-20}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROMPT_FILE="$SCRIPT_DIR/fix-issues-prompt.md"

# ── Required env vars ────────────────────────────────────────
check_var() {
  local var_name="$1"
  local var_value="${!var_name:-}"
  if [[ -z "$var_value" ]]; then
    echo "ERROR: $var_name is not set."
    echo "  export $var_name=<value>"
    exit 1
  fi
}

check_var ANTHROPIC_API_KEY
check_var GITHUB_TOKEN

# ── Verify tools are installed ───────────────────────────────
for cmd in claude gh node npm; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "ERROR: '$cmd' is not installed or not in PATH."
    exit 1
  fi
done

# ── Check for ready issues ───────────────────────────────────
echo "Fetching issues labeled '$ISSUE_LABEL' from $REPO..."
ISSUES=$(gh issue list \
  --repo "$REPO" \
  --label "$ISSUE_LABEL" \
  --state open \
  --limit "$ISSUE_LIMIT" \
  --json number,title \
  --jq '.[] | "#\(.number): \(.title)"')

if [[ -z "$ISSUES" ]]; then
  echo "No open issues with label '$ISSUE_LABEL'. Nothing to do."
  exit 0
fi

ISSUE_COUNT=$(echo "$ISSUES" | wc -l | tr -d ' ')
echo "Found $ISSUE_COUNT issue(s):"
echo "$ISSUES"
echo ""

# ── Collect issue numbers ────────────────────────────────────
ISSUE_NUMBERS=$(gh issue list \
  --repo "$REPO" \
  --label "$ISSUE_LABEL" \
  --state open \
  --limit "$ISSUE_LIMIT" \
  --json number \
  --jq '.[].number' | tr '\n' ',' | sed 's/,$//')

# ── Create branch name ──────────────────────────────────────
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BRANCH_NAME="${BRANCH_PREFIX}/${TIMESTAMP}-$$"

# ── Build the prompt ─────────────────────────────────────────
if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "ERROR: Prompt file not found: $PROMPT_FILE"
  exit 1
fi

PROMPT=$(cat "$PROMPT_FILE")
# Inject runtime values into prompt
PROMPT="${PROMPT//\{\{ISSUE_NUMBERS\}\}/$ISSUE_NUMBERS}"
PROMPT="${PROMPT//\{\{BRANCH_NAME\}\}/$BRANCH_NAME}"
PROMPT="${PROMPT//\{\{REPO\}\}/$REPO}"

# ── Run Claude Code ──────────────────────────────────────────
echo ""
echo "Starting Claude Code (headless)..."
echo "  Branch: $BRANCH_NAME"
echo "  Issues: $ISSUE_NUMBERS"
echo "  Repo:   $REPO"
echo ""

cd "$PROJECT_ROOT"

# Run Claude Code in headless mode with full permissions
claude -p "$PROMPT" \
  --dangerously-skip-permissions \
  --verbose \
  2>&1 | tee "$PROJECT_ROOT/scripts/fix-issues-$(date +%Y%m%d-%H%M).log"

echo ""
echo "Done. Check the log above and the PR on GitHub."
