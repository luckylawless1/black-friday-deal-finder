// Deal Desk — a Black Friday deal finder for make.fun's
// black-friday-deal-finder-01 bounty (Node 22, standard library only).
//
// The site itself is the app/ folder next to this file: plain static files
// (index.html, ES modules, one stylesheet, the deals in data.js) with no
// build step and nothing loaded over the network — every store link is a
// plain <a href>, not a load. The screenshots/ folder holds real browser
// renders of that site.
//
// This program hands the entry in. It copies app/ and screenshots/ from
// beside this file into the output directory and writes
// output/dossier.json with the vendored make.fun library
// (vendor/makefun-frontend.ts, the kit's copy, left unchanged: the scorer
// rebuilds the dossier with its own copy and compares the two byte for
// byte, so this file must not edit the library or the bytes it writes).
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output; inside
// the grader, /output is used. Both runs must write the same bytes, so
// this program does nothing time- or environment-dependent: it copies
// files and builds the dossier, nothing else.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');

function handIn() {
  // Start from a clean output directory so a stale file from an earlier
  // run can never ride along into the entry.
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  cpSync(appDir, join(outDir, 'app'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  if (existsSync(shotsDir)) {
    cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
  }

  // The scorer's own caps, as the kit states them: the dossier text is
  // capped at 160 KiB, at most 4 screenshots of 256 KiB each, app/ at
  // most 993 files and directories and 16 MiB in all. An entry past any
  // of those is refused here with the library's own words.
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

handIn();
