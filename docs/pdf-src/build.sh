#!/usr/bin/env bash
# Rebuild all docs/*.pdf from markdown. Needs pandoc + weasyprint.
set -euo pipefail
cd "$(dirname "$0")"
build() { # src.md out.pdf title
  tmp=$(mktemp --suffix=.html)
  pandoc "$1" -s --metadata pagetitle="$3" --css style.css --embed-resources -o "$tmp"
  weasyprint "$tmp" "../$2" 2>/dev/null
  rm -f "$tmp"; echo "built docs/$2"
}
build ../HANDOVER.md          HANDOVER.pdf           "Handover Baarns Mannenkoor"
build e-mail-instellen.md     e-mail-instellen.pdf   "E-mail instellen Baarns Mannenkoor"
