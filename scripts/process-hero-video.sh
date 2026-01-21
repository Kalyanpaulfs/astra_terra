#!/bin/bash

# Navigate to the root directory (assuming script is in scripts/)
cd "$(dirname "$0")/.." || exit

INPUT="public/video/hero.mp4"
OUTPUT="public/video/hero.webp"
TEMP_OUTPUT="public/video/hero_new.webp"

echo "Starting conversion of $INPUT to $TEMP_OUTPUT..."

# Crop 140 pixels from the top.
# Video is 3840x2160.
# crop=w:h:x:y
# To remove top 140 pixels: w=in_w, h=in_h-140, x=0, y=140
ffmpeg -i "$INPUT" \
  -vf "crop=in_w:in_h-140:0:140" \
  -c:v libwebp \
  -lossless 0 \
  -q:v 50 \
  -loop 0 \
  -an \
  -y \
  "$TEMP_OUTPUT"

if [ $? -eq 0 ]; then
    echo "Conversion successful. Replacing $OUTPUT with $TEMP_OUTPUT..."
    mv "$TEMP_OUTPUT" "$OUTPUT"
    echo "Done."
else
    echo "Error: ffmpeg conversion failed."
    exit 1
fi
