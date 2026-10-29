#!/usr/bin/env bash
# Extract the last frame from an MP4 for use as Seedance reference_image (continuity).
# Usage: extract-last-frame.sh input.mp4 output.jpg

set -euo pipefail
if [[ $# -lt 2 ]]; then
  echo "Usage: extract-last-frame.sh <input.mp4> <output.jpg>" >&2
  exit 1
fi
in="$1"
out="$2"
mkdir -p "$(dirname "$out")"
ffmpeg -y -hide_banner -loglevel error -sseof -1 -i "$in" -frames:v 1 -update 1 -q:v 2 "$out"
echo "extracted last frame -> $out"
