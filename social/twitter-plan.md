# MYCEL - X/Twitter plan

The account exists: https://x.com/mycelprotocol. It's linked from the site's nav, colophon, and README. Copy-paste-ready content below for actually populating it.

## Identity

- **Handle:** `@mycelprotocol` (live)
- **Display name:** `MYCEL`
- **Location field:** leave blank, or `Concept stage`
- **Link:** `https://mycelprotocol.xyz/` (or `https://mycelrh.github.io/mycel/` until DNS/SSL settle)
- **PFP:** `assets/mycel-avatar.png` - 512×512, square, reads fine at small sizes
- **Banner:** `assets/mycel-banner.png` - 1500×500, exactly X's recommended banner ratio

## Bio (under 160 chars)

Primary (155 chars):
```
Grows toward real demand, prunes what goes quiet. Concept relay network for Robinhood Chain. $MYC in development - no sale, no wallet connect. Real COIN data ↓
```

Alternate, more direct about honesty (148 chars):
```
A relay network that grows toward demand and prunes what goes quiet. Nothing to buy here - just a public, reproducible simulation. ↓
```

## Launch tweet (pin this one)

```
Most relay networks are wired once and frozen.

MYCEL grows toward real demand and prunes what goes quiet - the way mycelium grows toward a nutrient source, not the way a config file works.

$MYC is in development. No sale. No wallet connect. Just a reproducible simulation running on real COIN trading data.

mycelrh.github.io/mycel
```

## Launch thread (7 tweets, reply-chain under the pinned tweet)

**1/**
```
Most crypto infra is wired once and frozen. A route gets busy, nobody notices until it's a problem, then someone redeploys.

MYCEL is a relay mesh that senses demand itself and grows new routes before you'd file the ticket. 🧵
```

**2/**
```
The mechanism is six states: Sense → Grow → Reinforce → Prune → Reroute → Fossilize.

3 blocks of sustained demand = a new direct route grows.
5,000 quiet blocks = it's retired.
Every block's exact mesh shape gets recorded, forever.
```

**3/**
```
No fake benchmark. The genesis route (MYC/COIN·USD) is exercised by a deterministic sim run against 251 real days of Coinbase stock volume.

Real result: 6 grows, 4 reinforcements, 2 prunes - with exact dates. Rerun it yourself: node sim/mycel-sim.js
```

**4/**
```
We ran our own rug-check before anyone asked:

No contract deployed. No presale. No wallet-connect anywhere on the site. No LP to drain, because nothing is deployed yet.

Pre-launch concept, stated plainly instead of hidden.
```

**5/**
```
Don't trust the page - check the bytes. verify.html pins SHA-256 hashes of every core file. Hit "Check now" and your own browser re-hashes the live file with crypto.subtle. Nothing leaves your machine.

mycelrh.github.io/mycel/verify.html
```

**6/**
```
It's not a static demo. A GitHub Action refetches real COIN data daily, reruns the sim, and commits only if the output changed. First run found new data and auto-committed within minutes of setup.

github.com/mycelrh/mycel
```

**7/**
```
Everything is public: whitepaper, simulation code, raw market data, full commit history.

mycelrh.github.io/mycel
github.com/mycelrh/mycel

Concept stage. $MYC in development. Just real, reproducible work.
```

## Evergreen / follow-up tweets (post over the following days, any order)

**The honesty flex** (posting a real bug you found and fixed builds more trust than pretending everything was perfect):
```
Our own verify page had a real bug: the pinned hashes were computed on Windows CRLF line endings while the repo actually serves LF, so it would've falsely flagged unedited files as "changed."

Found it, fixed it, wrote it up in the changelog instead of quietly patching it.
```

**The chart post** (screenshot the live COIN-volume chart from the site):
```
Real Coinbase stock volume, real dates, real events. Green = grow, blue = reinforce, orange = prune.

Not illustrative. This is what sim/mycel-sim.js actually produced against a year of trading data.
```

**The recurring daily-update template** (use once the bot has run a few times and actually changed something):
```
Daily refresh: [N] grows, [N] reinforcements, [N] prunes since yesterday, from a fresh pull of real COIN volume.

Same seed, same script, anyone can rerun it: node sim/mycel-sim.js

mycelrh.github.io/mycel/explorer.html
```

**The "we're not asking for money" post** (worth repeating - it's the single biggest thing that separates this from everything else in a crypto timeline):
```
Reminder: there is nothing to buy here. No contract, no presale, no wallet connect anywhere on the site.

This is a whitepaper, a simulation, and real market data - public and reproducible. That's the whole pitch right now.
```

## Notes

- Every link above should point at the real live site/repo - don't post any of this until you've double-checked the URLs still resolve.
- The thread leans on specifics (exact dates, exact counts, exact commands) on purpose - that's what reads as credible to a skeptical crypto audience, not adjectives.
- Nothing here mentions a launch date, a token, or an investment angle, on purpose - matches the site's own "nothing to rug" stance.
