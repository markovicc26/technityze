#!/usr/bin/env bash
# Encode JPEG frame sequence captured by record-hover.mjs into web-optimized
# mp4 (h.264) + webm (vp9) + first-frame poster .webp.
#
# Usage: ./scripts/encode-hover.sh <slug> [fps=24]
#
# Output: public/img/technityze/work/<slug>-loop.{mp4,webm,webp}

set -euo pipefail

SLUG="${1:?slug required}"
# Output playback fps for the encoded loop
FPS="${2:-24}"
# Realtime duration of the original capture in seconds (record-hover.mjs
# default is 7). We use this to compute input fps so playback equals the
# original timing, regardless of how many frames the screencast produced.
CAPTURE_SECONDS="${3:-7}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRAMES_DIR="$ROOT/public/img/technityze/work/_raw/${SLUG}_frames"
OUT_DIR="$ROOT/public/img/technityze/work"

if [ ! -d "$FRAMES_DIR" ]; then
  echo "missing frames dir: $FRAMES_DIR"
  exit 1
fi

# Captured frames come in at the screencast's variable rate. To preserve
# real-time playback (so a 7s capture plays back as 7s), feed ffmpeg the
# input fps that matches the original timing (frames / capture_seconds),
# then re-encode at the target output fps.
FRAME_COUNT=$(find "$FRAMES_DIR" -name "f_*.jpg" | wc -l | tr -d ' ')
INPUT_FPS=$(awk -v c="$FRAME_COUNT" -v s="$CAPTURE_SECONDS" 'BEGIN { printf "%.3f", c/s }')
echo "[${SLUG}] encoding $FRAME_COUNT frames - input ${INPUT_FPS}fps -> output ${FPS}fps"

# 1920x1080 source -> downscale to 1280x720 for the hover preview (smaller
# bandwidth, hover videos shouldn't be 1080p). Keep the source crisp with
# yuv420p so all browsers can decode.
COMMON_VF="scale=1280:720:flags=lanczos,format=yuv420p"

# h.264 mp4 - widest compatibility, used as first <source>
ffmpeg -y -hide_banner -loglevel error \
  -framerate "$INPUT_FPS" -i "$FRAMES_DIR/f_%05d.jpg" \
  -vf "$COMMON_VF,fps=${FPS}" \
  -c:v libx264 -preset slow -crf 26 \
  -movflags +faststart \
  -an \
  "$OUT_DIR/${SLUG}-loop.mp4"

# vp9 webm - smaller, used as <source type="video/webm"> fallback for
# browsers that prefer it
ffmpeg -y -hide_banner -loglevel error \
  -framerate "$INPUT_FPS" -i "$FRAMES_DIR/f_%05d.jpg" \
  -vf "$COMMON_VF,fps=${FPS}" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
  -an \
  "$OUT_DIR/${SLUG}-loop.webm"

# First-frame webp poster - shown while video buffers / not yet hovered.
# brew ffmpeg builds ship without libwebp, so use cwebp directly. ffmpeg
# downscales the jpeg to 1280x720, cwebp encodes it to webp.
TMP_POSTER="$FRAMES_DIR/_poster.jpg"
ffmpeg -y -hide_banner -loglevel error \
  -i "$FRAMES_DIR/f_00000.jpg" \
  -vf "scale=1280:720:flags=lanczos" \
  "$TMP_POSTER"
cwebp -quiet -q 78 "$TMP_POSTER" -o "$OUT_DIR/${SLUG}-loop.webp"
rm "$TMP_POSTER"

echo "[${SLUG}] done:"
ls -lh "$OUT_DIR/${SLUG}-loop."{mp4,webm,webp} | awk '{print "  "$9, $5}'
