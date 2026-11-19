// Tells Google's Indexing API when a job page is published, changed or removed,
// so roles show up in (and drop out of) Google for Jobs quickly. No dependencies.
//
//   node scripts/notify-indexing.mjs --all             notify every live job page + careers.html
//   node scripts/notify-indexing.mjs --changes <file>  notify the changes a sync run wrote
//   add --dry-run to print what would be sent without contacting Google
//
// Credentials: env GOOGLE_INDEXING_KEY holds the service-account JSON (raw or
// base64). The service account must be an Owner of the Search Console property.
// Without it, every call logs one line and does nothing, so the job sync keeps
// working. Errors are logged, never thrown: a failed ping must not fail a sync.
//
// Quota: Google allows 200 publish requests a day by default. Each run sends at
// most INDEXING_MAX_PER_RUN (default 100, i.e. two runs a day stay under 200)
// and stops early on HTTP 429.

import { createSign } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const SITE = 'https://prlsitesolutions.co.uk';
const SCOPE = 'https://www.googleapis.com/auth/indexing';
const API = process.env.INDEXING_API_BASE || 'https://indexing.googleapis.com'; // override only for tests
const MAX_PER_RUN = Math.max(1, +process.env.INDEXING_MAX_PER_RUN || 100);

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

export function loadKey(raw = process.env.GOOGLE_INDEXING_KEY) {
  if (!raw || !raw.trim()) return null;
  let text = raw.trim();
  if (!text.startsWith('{')) text = Buffer.from(text, 'base64').toString('utf8');
  const key = JSON.parse(text);
  if (!key.client_email || !key.private_key) throw new Error('GOOGLE_INDEXING_KEY is not a service-account key (needs client_email and private_key)');
  return key;
}

export function buildJwt(key, now = Math.floor(Date.now() / 1000)) {
  const header = { alg: 'RS256', typ: 'JWT', ...(key.private_key_id ? { kid: key.private_key_id } : {}) };
  const claims = { iss: key.client_email, scope: SCOPE, aud: key.token_uri || 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key);
  return `${unsigned}.${b64url(signature)}`;
}

async function getToken(key) {
  const res = await fetch(key.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: buildJwt(key) }),
    signal: AbortSignal.timeout(15000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) throw new Error(`token request failed: HTTP ${res.status} ${body.error || ''} ${body.error_description || ''}`.trim());
  return body.access_token;
}

/**
 * changes: { updated: string[], deleted: string[] } of absolute URLs.
 * Returns { sent, failed, skipped } and never throws.
 */
export async function notify(changes, { dryRun = false, log = console.log } = {}) {
  const queue = [
    ...[...new Set(changes.updated || [])].map((url) => ({ url, type: 'URL_UPDATED' })),
    ...[...new Set(changes.deleted || [])].map((url) => ({ url, type: 'URL_DELETED' })),
  ];
  const result = { sent: 0, failed: 0, skipped: 0 };
  if (!queue.length) { log('Indexing API: no job page changes to report.'); return result; }

  let key;
  try { key = loadKey(); } catch (err) { log(`Indexing API: skipped — ${err.message}`); result.skipped = queue.length; return result; }
  if (!key && !dryRun) { log(`Indexing API: skipped — GOOGLE_INDEXING_KEY not set (${queue.length} change(s) not sent).`); result.skipped = queue.length; return result; }

  const batch = queue.slice(0, MAX_PER_RUN);
  result.skipped = queue.length - batch.length;
  if (dryRun) {
    for (const q of batch) log(`Indexing API (dry run): ${q.type} ${q.url}`);
    if (key) { buildJwt(key); log(`Indexing API (dry run): JWT built for ${key.client_email}`); }
    return result;
  }

  let token;
  try { token = await getToken(key); } catch (err) { log(`Indexing API: ${err.message} — nothing sent.`); result.failed = batch.length; return result; }

  for (let i = 0; i < batch.length; i++) {
    const q = batch[i];
    try {
      const res = await fetch(`${API}/v3/urlNotifications:publish`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ url: q.url, type: q.type }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) { result.sent++; log(`Indexing API: ${q.type} ${q.url}`); continue; }
      const text = (await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
      result.failed++;
      log(`Indexing API: HTTP ${res.status} for ${q.type} ${q.url} ${text}`);
      if (res.status === 429) { result.skipped += batch.length - i - 1; log('Indexing API: daily quota reached — stopping; the rest go in a later run or via --all.'); break; }
      if (res.status === 401 || res.status === 403) { result.skipped += batch.length - i - 1; log('Indexing API: not authorised — is the service account an Owner of the Search Console property, and is the Indexing API enabled?'); break; }
    } catch (err) {
      result.failed++;
      log(`Indexing API: ${q.type} ${q.url} failed — ${err.message}`);
    }
  }
  if (result.skipped) log(`Indexing API: ${result.skipped} change(s) held back by the per-run limit (${MAX_PER_RUN}).`);
  log(`Indexing API: ${result.sent} sent, ${result.failed} failed.`);
  return result;
}

export function allJobUrls(root = new URL('../', import.meta.url)) {
  const dir = new URL('jobs/', root);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(new URL(`${d.name}/index.html`, dir)))
    .map((d) => `${SITE}/jobs/${d.name}/`)
    .sort();
}

async function cli() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  let changes;
  if (args.includes('--all')) {
    changes = { updated: [...allJobUrls(), `${SITE}/careers.html`], deleted: [] };
  } else if (args.includes('--changes')) {
    const file = args[args.indexOf('--changes') + 1];
    if (!file || !existsSync(file)) { console.log(`Indexing API: no changes file (${file || 'none given'}) — nothing to do.`); return; }
    changes = JSON.parse(readFileSync(file, 'utf8'));
  } else {
    console.log('Usage: node scripts/notify-indexing.mjs --all | --changes <file> [--dry-run]');
    return;
  }
  await notify(changes, { dryRun });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  cli().catch((err) => console.log(`Indexing API: unexpected error — ${err.message}`)); // never fail the caller
}
