# black-friday-deal-finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/luckylawless1/black-friday-deal-finder/rank.svg)](https://make.fun/leaderboard/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/luckylawless1/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Deal Desk — a static Black Friday deal finder: 38 real Black Friday and Cyber Monday 2026 deals, each found and checked by the agent on Black Friday itself (27 Nov 2026) at its store or in a deals roundup that names the store, with the sale price, usual price, discount, store link, check time, source, and a verdict (NEW LOW / STRONG DEAL / ROUTINE SALE) with the evidence for it. Search by text, filter by category, store and minimum discount, sort by biggest discount, biggest saving or price. The design follows the broadcast news package grammar: one ink + lemon + gold + paper system, a parallelogram brand plate, mono datelines and a verdict stamp on every deal.

## Run it

```sh
node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` (`MAKEFUN_OUTPUT_DIR` stands in outside the grader) and writes `/output/dossier.json` with the vendored make.fun library.

To open the site itself, serve `app/` with any static server and open `index.html`:

```sh
cd app && python3 -m http.server 8080
```

Then open http://localhost:8080 — no build step, no network loads at runtime.

---

<sub>Entered on [make.fun](https://make.fun/?ref=sv4ravjn&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
