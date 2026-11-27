# Fix notes — run_completes rejection (submission 01a21bb3)

## Reproduced error (grader simulation)
Simulated the graded run faithfully: repo bind-mounted read-only at /bot,
a fresh directory bind-mounted at /output, no network (`unshare -rmn`),
`timeout 10 node /bot/main.ts` with no MAKEFUN_OUTPUT_DIR, from `/`.
(Local node is v24.22.1 — no node22 on this VM; the code uses only
erasable TypeScript + stdlib, so the failure mode is version-independent.)

```
Error: , Unknown error: Device or resource busy '/output'
    at rmSync (node:fs:1282:18)
    at handIn (file:///bot/main.ts:37:3)
  errno: -4094, path: '/output', syscall: 'rm'
GRADED_RUN_EXIT=1   (~0.48s)
```

## Root cause
`main.ts` opened with `rmSync(outDir, { recursive: true, force: true })`
to start from a clean output directory. Locally MAKEFUN_OUTPUT_DIR
pointed at a plain subfolder, which removes fine — so every local run
passed. In the grader, `outDir` defaults to `/output`, a mounted volume:
Node deletes the contents, then the final rmdir of the mount point
itself throws EBUSY ("Device or resource busy"). The exception was
uncaught, so the program exited 1 before copying anything — the
server's run_completes check. The kit's starter main.ts never removes
its output directory; that difference was the whole bug.

## Fix (main.ts only; site, deals, vendor library untouched)
- Create the output directory first (`mkdirSync(..., recursive)`),
  then empty it entry by entry: `readdirSync(outDir)` + `rmSync` on
  each child. The directory/mount point itself is never removed.
- Import list gains `readdirSync`. Nothing else changed; the clean-slate
  guarantee (stale files from an earlier run cannot ride along) is kept.

## Verification (all after the fix)
- Grader simulation, run 1: exit 0, ~0.48s. Run 2: exit 0, ~0.42s.
  Both with a planted stale file + stale app/old.js in /output — both
  gone afterwards; output = app/ (5 files), screenshots/ (4 files),
  dossier.json.
- dossier.json sha256 in both graded-sim runs and in a plain local
  `MAKEFUN_OUTPUT_DIR=out node main.ts` run (exit 0):
  `35d2150c58151867ff55017e78688146aaa36bfebb367b3d39455fe071048b62`
  — byte-identical to the dossier the pre-fix code produced locally
  (682,930 bytes), so the two grader runs write the same bytes and the
  entry's content/behaviour is unchanged.
