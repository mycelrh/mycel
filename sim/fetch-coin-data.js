// Refetches real Coinbase (COIN) daily OHLCV from Yahoo Finance's public
// chart API and rewrites sim/coin-daily.csv. Used by the daily GitHub Actions
// workflow (.github/workflows/update-sim.yml) to keep the simulation's input
// data current. Safe to run manually too: `node sim/fetch-coin-data.js`

const fs = require('fs');
const path = require('path');

async function main() {
  const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/COIN?range=1y&interval=1d', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) throw new Error(`Yahoo Finance fetch failed: HTTP ${res.status}`);
  const data = await res.json();
  const result = data.chart.result[0];
  const ts = result.timestamp;
  const quote = result.indicators.quote[0];

  const rows = [];
  for (let i = 0; i < ts.length; i++) {
    if (quote.close[i] == null || quote.volume[i] == null) continue;
    const date = new Date(ts[i] * 1000).toISOString().slice(0, 10);
    rows.push([
      date,
      quote.close[i].toFixed(2),
      quote.high[i].toFixed(2),
      quote.low[i].toFixed(2),
      Math.round(quote.volume[i]),
    ].join(','));
  }

  const csv = 'date,close,high,low,volume\n' + rows.join('\n') + '\n';
  fs.writeFileSync(path.join(__dirname, 'coin-daily.csv'), csv);
  console.log(`Wrote ${rows.length} trading days to sim/coin-daily.csv (${rows[0].split(',')[0]} to ${rows[rows.length - 1].split(',')[0]})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
