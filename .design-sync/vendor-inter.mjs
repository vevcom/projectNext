#!/usr/bin/env node
// Downloads Inter woff2 files into .design-sync/.cache/fonts/Inter/.
//
// `src/styles/_fonts.scss` sets `$primary: 'Inter', sans-serif` — Inter is the
// body font for the entire site — but the app never ships an @font-face for it,
// so production silently falls back to system sans. The design system should
// render what the stylesheet asks for, so we vendor Inter here.
//
// Inter is SIL Open Font License 1.1 (redistribution permitted).
// Run once; the cache is gitignored, so a fresh clone re-downloads.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(fileURLToPath(new URL('.', import.meta.url)), '.cache/fonts/Inter')
const WEIGHTS = [300, 400, 500, 700]
const CSS_URL = `https://fonts.googleapis.com/css2?family=Inter:wght@${WEIGHTS.join(';')}&display=swap`

// Google serves woff2 only to UAs that advertise support.
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

mkdirSync(OUT, { recursive: true })

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text()

// Each @font-face block carries one weight and one src url. Pair them up, and
// keep only the `latin` subset blocks (the last of each weight in Google's
// output) so we ship four files rather than forty.
const blocks = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(match => match[1])
const picked = new Map()
for (const block of blocks) {
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1]
    const url = block.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1]
    if (!weight || !url || !WEIGHTS.includes(Number(weight))) continue
    picked.set(weight, url) // later (latin) block wins
}

if (picked.size === 0) throw new Error('no woff2 urls found in the Google Fonts CSS response')

for (const [weight, url] of picked) {
    const bytes = new Uint8Array(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer())
    const dest = join(OUT, `Inter-${weight}.woff2`)
    writeFileSync(dest, bytes)
    console.error(`  Inter-${weight}.woff2  ${(bytes.length / 1024).toFixed(1)} KB`)
}

if (!existsSync(join(OUT, 'Inter-400.woff2'))) {
    throw new Error('Inter-400 (regular) was not downloaded — check the Google Fonts response')
}
