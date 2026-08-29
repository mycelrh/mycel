// MYCEL reference simulation
//
// Implements the six-state mechanism from docs.html (Sense / Grow / Reinforce /
// Prune / Reroute / Fossilize) against REAL Coinbase (COIN) daily trading data
// (sim/coin-daily.csv: date, close, high, low, volume - pulled from Yahoo
// Finance's public chart API, https://query1.finance.yahoo.com/v8/finance/chart/COIN,
// one year of daily bars, no API key required).
//
// MODELING NOTE - read this before quoting a number from this script anywhere:
// the whitepaper's thresholds (grow at 3 blocks, reinforce at 500, prune at
// 5000) describe a network running on fast chain blocks. Real intraday COIN
// order flow isn't public for free, so this simulation samples demand once
// per trading day and treats the day as 200 simulation "ticks" (~7-minute
// slices) - calibrated so the 500/5000-tick thresholds land inside the
// elevated/quiet streak lengths actually observed in a year of real COIN
// volume (longest elevated run: 5 days; longest quiet run: 28 days), so
// REINFORCE and PRUNE are reachable but not automatic. This is a coarse,
// documented approximation used to get reproducible, day-scale dynamics out
// of real market data, not a claim about actual block timing on any chain.
//
// Run it:  node sim/mycel-sim.js
// Output:  sim/fossil-record.json   (one snapshot per trading day, for explorer.html)
//          sim/summary.json         (aggregate stats, quoted on index.html / docs.html)

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, 'coin-daily.csv');
const TICKS_PER_DAY = 200;       // ~7-minute ticks
const GROW_TICKS = 3;            // matches whitepaper GROW threshold
const REINFORCE_TICKS = 500;     // matches whitepaper REINFORCE threshold
const PRUNE_TICKS = 5000;        // matches whitepaper PRUNE threshold
const ELEVATED_Z = 1.0;          // volume z-score above which a day counts as "elevated demand"
const ROLLING_WINDOW = 20;       // trading days used to compute the rolling mean/stdev
const SEED = 0x4d594331;         // "MYC1" - fixed seed, so reruns are byte-identical

// ---- deterministic PRNG (mulberry32) so every run produces the same output ----
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);

// ---- load real market data ----
function loadCsv(p) {
  const lines = fs.readFileSync(p, 'utf8').trim().split('\n').slice(1);
  return lines.map((line) => {
    const [date, close, high, low, volume] = line.split(',');
    return { date, close: +close, high: +high, low: +low, volume: +volume };
  });
}

const days = loadCsv(CSV_PATH);

// ---- baseline mesh topology (always alive, mirrors the diagram on index.html) ----
const BASELINE_EDGES = [
  'R1-R2', 'R2-R3', 'R3-R4',
  'R5-R6', 'R6-COIN', 'COIN-R7',
  'R1-R5', 'R2-R6', 'R3-COIN', 'R4-R7',
  'R4-CHAIN', 'R7-CHAIN',
];

// ---- candidate shortcut edges that can grow toward the COIN·USD demand node ----
const CANDIDATE_EDGES = ['R1-COIN', 'R2-COIN', 'R5-COIN', 'COIN-CHAIN'];

const edgeState = {};
for (const e of CANDIDATE_EDGES) {
  edgeState[e] = { alive: false, reinforced: false, streakElevated: 0, streakQuiet: 0, grownOn: null, reinforcedOn: null, prunedOn: null };
}

const events = [];      // { day, date, edge, type }
const fossilRecord = []; // one snapshot per trading day

let tick = 0;

for (let d = 0; d < days.length; d++) {
  const day = days[d];

  // rolling volume z-score using the prior ROLLING_WINDOW days (warmup = not elevated)
  let elevated = false;
  if (d >= ROLLING_WINDOW) {
    const window = days.slice(d - ROLLING_WINDOW, d).map((x) => x.volume);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance = window.reduce((a, b) => a + (b - mean) ** 2, 0) / window.length;
    const stdev = Math.sqrt(variance) || 1;
    const z = (day.volume - mean) / stdev;
    elevated = z > ELEVATED_Z;
  }

  const dayEvents = [];

  for (let s = 0; s < TICKS_PER_DAY; s++) {
    tick++;

    for (const e of CANDIDATE_EDGES) {
      const st = edgeState[e];
      // each candidate route senses the day's demand independently - small
      // deterministic per-edge jitter so an "elevated" day isn't perfectly
      // uniform across every route, and a quiet day can still throw a brief,
      // harmless blip on any one of them
      const localElevated = elevated ? rand() >= 0.0005 : rand() < 0.0002;
      if (localElevated) {
        st.streakElevated++;
        st.streakQuiet = 0;
        if (!st.alive && st.streakElevated >= GROW_TICKS) {
          st.alive = true;
          st.grownOn = day.date;
          dayEvents.push({ edge: e, type: 'GROW' });
        }
        if (st.alive && !st.reinforced && st.streakElevated >= REINFORCE_TICKS) {
          st.reinforced = true;
          st.reinforcedOn = day.date;
          dayEvents.push({ edge: e, type: 'REINFORCE' });
        }
      } else {
        st.streakQuiet++;
        st.streakElevated = 0;
        if (st.alive && st.streakQuiet >= PRUNE_TICKS) {
          st.alive = false;
          st.reinforced = false;
          st.prunedOn = day.date;
          st.streakQuiet = 0;
          dayEvents.push({ edge: e, type: 'PRUNE' });
        }
      }
    }
  }

  for (const ev of dayEvents) events.push({ day: d, date: day.date, ...ev });

  fossilRecord.push({
    day: d,
    date: day.date,
    close: day.close,
    volume: day.volume,
    elevated,
    aliveEdges: CANDIDATE_EDGES.filter((e) => edgeState[e].alive),
    reinforcedEdges: CANDIDATE_EDGES.filter((e) => edgeState[e].reinforced),
    events: dayEvents,
  });
}

// ---- aggregate summary ----
const grows = events.filter((e) => e.type === 'GROW');
const reinforces = events.filter((e) => e.type === 'REINFORCE');
const prunes = events.filter((e) => e.type === 'PRUNE');
const finalAlive = CANDIDATE_EDGES.filter((e) => edgeState[e].alive);
const firstGrow = grows[0] || null;

const summary = {
  generatedAt: new Date().toISOString(),
  seed: SEED,
  params: { TICKS_PER_DAY, GROW_TICKS, REINFORCE_TICKS, PRUNE_TICKS, ELEVATED_Z, ROLLING_WINDOW },
  dataRange: { from: days[0].date, to: days[days.length - 1].date, tradingDays: days.length },
  liveConnections: BASELINE_EDGES.length + finalAlive.length,
  baselineConnections: BASELINE_EDGES.length,
  candidateEdges: CANDIDATE_EDGES.length,
  finalAliveShortcuts: finalAlive,
  totalGrowEvents: grows.length,
  totalReinforceEvents: reinforces.length,
  totalPruneEvents: prunes.length,
  firstGrowEvent: firstGrow,
  daysSinceFirstGrow: firstGrow ? days.length - 1 - firstGrow.day : null,
};

fs.writeFileSync(path.join(__dirname, 'fossil-record.json'), JSON.stringify(fossilRecord, null, 2));
fs.writeFileSync(path.join(__dirname, 'summary.json'), JSON.stringify(summary, null, 2));

console.log(JSON.stringify(summary, null, 2));
