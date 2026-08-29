// Re-pins the SHA-256 hashes on verify.html for the two files the daily
// update workflow actually changes (sim/coin-daily.csv, sim/summary.json)
// and stamps the "computed" date. index.html, docs.html, and sim/mycel-sim.js
// aren't touched by that workflow, so their pinned hashes are left alone.

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const VERIFY_PATH = path.join(ROOT, 'verify.html');

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function replaceHash(html, fileName, newHash) {
  const re = new RegExp(
    "(\\{ name: '" + fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "', hash: ')[0-9a-f]{64}('\\s*\\})"
  );
  if (!re.test(html)) throw new Error(`Could not find a hash entry for ${fileName} in verify.html`);
  return html.replace(re, `$1${newHash}$2`);
}

let html = fs.readFileSync(VERIFY_PATH, 'utf8');
html = replaceHash(html, 'sim/coin-daily.csv', sha256(path.join(ROOT, 'sim/coin-daily.csv')));
html = replaceHash(html, 'sim/summary.json', sha256(path.join(ROOT, 'sim/summary.json')));

const today = new Date().toISOString().slice(0, 10);
html = html.replace(/SHA-256, computed \d{4}-\d{2}-\d{2}/, `SHA-256, computed ${today}`);

fs.writeFileSync(VERIFY_PATH, html);
console.log(`verify.html hashes re-pinned for ${today}`);
