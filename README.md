# MYCEL

A relay network concept for Robinhood Chain whose topology isn't fixed by configuration. Relays sense real trading demand and grow direct connections toward it — the way mycelium grows toward a nutrient source — then prune what goes quiet.

**Live site:** https://mycelrh.github.io/mycel/
**Whitepaper:** https://mycelrh.github.io/mycel/docs.html
**Explorer:** https://mycelrh.github.io/mycel/explorer.html
**Verify:** https://mycelrh.github.io/mycel/verify.html

## What this actually is

A concept project, not a deployed network. There is no token sale, no contract, no wallet connection anywhere on the site. What's real:

- A deterministic simulation (`sim/mycel-sim.js`) of the six-state mechanism described in the whitepaper
- Run against **251 real trading days of Coinbase (COIN) stock data** (`sim/coin-daily.csv`), pulled from Yahoo Finance's public chart API
- Every figure quoted on the site — connections grown, reinforced, pruned, and their exact dates — is that script's literal, reproducible output

## Reproduce it

```
node sim/mycel-sim.js
```

Same fixed seed, same input data, same output every time. It rewrites `sim/fossil-record.json` (a daily snapshot of the mesh) and `sim/summary.json` (the aggregate stats quoted on the site).

## Structure

```
index.html        landing page
docs.html         whitepaper
explorer.html     the full 251-day simulation record, rendered from fossil-record.json
verify.html       SHA-256 hashes of the core files, checkable in-browser or offline
changelog.html    build log
sim/
  mycel-sim.js    the simulation
  coin-daily.csv  real COIN daily OHLCV data
  fossil-record.json / summary.json   generated output (checked in for the explorer/site to read)
assets/           avatar and banner source (avatar.html, banner.html) + rendered PNGs
```

## Non-affiliation

MYCEL is an independent concept project. It is not affiliated with, endorsed by, or built by Robinhood Markets, Inc. "Robinhood Chain" is referenced only as the intended deployment target.
