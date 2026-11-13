#!/usr/bin/env bash
# Aethric — outside-in health check. Run from anywhere (cron/CI/other node).
set -uo pipefail
URL="${1:-https://hazem-soussi-ha.github.io/pof-thinking-machine/}"
CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$URL")
if [ "$CODE" = "200" ]; then
  echo "$(date -u +%FT%TZ) UP   $CODE $URL"
  exit 0
else
  echo "$(date -u +%FT%TZ) DOWN $CODE $URL" >&2
  exit 1
fi
