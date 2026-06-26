#!/usr/bin/env bash
# Copy remaining source files to alternates/ with descriptive names
SRC="/Users/pratik/Desktop/Corners/compressed-images-41zqiky3"
ALT="/Users/pratik/Desktop/Corners/shopify-upload/alternates"

copy_alt() { cp "$SRC/$1" "$ALT/$2" 2>/dev/null || true; }

# Dunari chair alternates
copy_alt "compressed-001 with shadow_01.webp" "dunari-chair__001-with-shadow.webp"
copy_alt "compressed-002.webp" "dunari-chair__002-angle.webp"
copy_alt "compressed-002 with shadow_01.webp" "dunari-chair__002-with-shadow.webp"
copy_alt "compressed-DSC00251.webp" "dunari-chair__base-detail.webp"
copy_alt "compressed-DSC00300.webp" "dunari-chair__lifestyle-reclining.webp"

# Eira chair alternates
copy_alt "compressed-DSC09817 001.webp" "eira-chair__studio-alt-1.webp"
copy_alt "compressed-DSC09817 003.webp" "eira-chair__studio-alt-2.webp"
copy_alt "compressed-DSC00470-Edit copy.webp" "eira-chair__lifestyle-full.webp"
copy_alt "compressed-DSC00327-Edit copy.webp" "eira-chair__lifestyle-with-navy-rug.webp"
copy_alt "compressed-DSC00339-Edit copy.webp" "eira-chair__lifestyle-set-high-angle.webp"
copy_alt "compressed-DSC00342-Edit copy.webp" "eira-chair__lifestyle-set-alt.webp"
copy_alt "compressed-DSC00356.webp" "eira-chair__lifestyle-magazine.webp"
copy_alt "compressed-DSC00364.webp" "eira-chair__lifestyle-magazine-alt.webp"
copy_alt "compressed-DSC00385-Edit copy.webp" "eira-chair__lifestyle-floor-seated.webp"
copy_alt "compressed-DSC00396-Edit copy.webp" "eira-chair__lifestyle-meditation.webp"

# Eira table alternates
copy_alt "compressed-Layer 1 002 copy01.webp" "eira-table__studio-offset.webp"
copy_alt "compressed-DSC00458 copy01.webp" "eira-table__studio-with-pebbles-1.webp"
copy_alt "compressed-DSC00458 copy03.webp" "eira-table__studio-with-pebbles-2.webp"
copy_alt "compressed-DSC00409.webp" "eira-table__lifestyle-rug-topdown.webp"

# Dunari table alternates (tray-top side table)
copy_alt "compressed-DSC00049 copy 01.webp" "dunari-table__tray-top-clean-alt.webp"
copy_alt "compressed-DSC00049 copy 02.webp" "dunari-table__tray-top-styled.webp"
copy_alt "compressed-DSC00049 copy 03.webp" "dunari-table__tray-top-styled-alt.webp"

# Dunari ottoman alternates
copy_alt "compressed-Layer 006.webp" "dunari-ottoman__studio-alt.webp"
copy_alt "compressed-Layer 007.webp" "dunari-ottoman__studio-with-sphere.webp"
copy_alt "compressed-DSC00219.webp" "dunari-ottoman__lifestyle-with-book.webp"
copy_alt "compressed-DSC00197-Edit copy(1).webp" "dunari-ottoman__lifestyle-lean-alt.webp"

# Dunari rug alternates
copy_alt "compressed-DSC00007 copy.webp" "dunari-rug__detail-ripple-black-bg.webp"
copy_alt "compressed-DSC00007  copy.webp" "dunari-rug__detail-ripple-white-bg.webp"
copy_alt "compressed-DSC00224.webp" "dunari-rug__lifestyle-texture-hand.webp"
copy_alt "compressed-DSC00227-Edit copy.webp" "dunari-rug__lifestyle-zen-garden-1.webp"
copy_alt "compressed-DSC00229.webp" "dunari-rug__lifestyle-zen-garden-2.webp"

# Eira rug navy alternates
copy_alt "compressed-DSC09853 copy.webp" "eira-rug-navy__detail-edge.webp"

# Biophilic rug alternates
copy_alt "compressed-DSC00086 copy.webp" "biophilic-rug__detail-stone-1.webp"
copy_alt "compressed-DSC00087 copy.webp" "biophilic-rug__detail-stone-2.webp"
copy_alt "compressed-DSC00091 copy.webp" "biophilic-rug__detail-stone-3.webp"
copy_alt "compressed-DSC002650013.webp" "biophilic-rug__lifestyle-hero-alt-crop.webp"

# Dunari collection lifestyle
copy_alt "compressed-DSC00176 copy001 1.webp" "dunari-collection__hero-black-bg.webp"
copy_alt "compressed-DSC00187-Edit 001.webp" "dunari-collection__reading-alt-1.webp"
copy_alt "compressed-DSC00187-Edit copy.webp" "dunari-collection__reading-alt-2.webp"

echo "Alternates copied: $(ls -1 "$ALT" | wc -l | tr -d ' ')"
